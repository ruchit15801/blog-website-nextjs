"use client";
import Image from "next/image";
import Script from "next/script";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";

export default function GameDetail({ gameDetails, name }) {
  const [showIframe, setShowIframe] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [gameError, setGameError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [gameReady, setGameReady] = useState(false);
  const iframeRef = useRef(null);
  const modalContainerRef = useRef(null);
  const [isPortrait, setIsPortrait] = useState(true);
  const [needsTap, setNeedsTap] = useState(false);

  const prefersLandscape = useMemo(() => {
    const w = Number(gameDetails?.width) || 0;
    const h = Number(gameDetails?.height) || 0;
    if (w && h) return w > h;
    const cat = (gameDetails?.category || "").toLowerCase();
    return ["racing", "sports", "arcade"].some(k => cat.includes(k));
  }, [gameDetails]);

  useEffect(() => {
    const onResize = () => {
      setIsPortrait(typeof window !== 'undefined' ? window.innerHeight > window.innerWidth : true);
      setIsMobile(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    };
    onResize();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);
  const router = useRouter();
  const hiddenAdsRef = useRef([]);
  const observerRef = useRef(null);

  // Listen for console errors to catch gamepad/permissions issues
  const handleConsoleError = React.useCallback((event) => {
    const error = event.detail || event.error || event.message || '';
    if (typeof error === 'string' && (
      error.includes('gamepad') || 
      error.includes('permissions policy') ||
      error.includes('SecurityError') ||
      error.includes('Failed to execute')
    )) {
      console.warn('Game error caught and handled:', error);
      // Don't show error for gamepad issues, just log them
      if (!error.includes('gamepad')) {
        setGameError('Game encountered an error. Please try again.');
      }
    }
  }, []);

  React.useEffect(() => {
    if (showIframe) {
      document.body.classList.add('overflow-hidden');
      document.body.classList.add('modal-open');
      setGameError(null); // Reset error state when opening
      // Gate inputs for mobile to satisfy user-activation requirements
      try {
        const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
        setNeedsTap(Boolean(isTouch));
      } catch { setNeedsTap(false); }

      window.addEventListener('error', handleConsoleError);
      window.addEventListener('unhandledrejection', handleConsoleError);

      // Mobile touch event forwarding for cross-origin content
      if (isMobile) {
        const handleTouchEvent = (e) => {
          // Forward touch events to iframe content
          try {
            const iframe = iframeRef.current;
            if (iframe && iframe.contentWindow) {
              const rect = iframe.getBoundingClientRect();
              const touch = e.touches[0];
              if (touch && rect.left <= touch.clientX && touch.clientX <= rect.right && 
                  rect.top <= touch.clientY && touch.clientY <= rect.bottom) {
                // Let the iframe handle the touch event
                iframe.focus();
                
                // Force click on any element under the touch point
                const element = document.elementFromPoint(touch.clientX, touch.clientY);
                if (element && (element.tagName === 'BUTTON' || element.getAttribute('role') === 'button' || element.onclick)) {
                  element.click();
                }
              }
            }
          } catch {}
        };

        const handleClickEvent = (e) => {
          // Also handle click events for better compatibility
          try {
            const iframe = iframeRef.current;
            if (iframe && iframe.contentWindow) {
              const rect = iframe.getBoundingClientRect();
              if (rect.left <= e.clientX && e.clientX <= rect.right && 
                  rect.top <= e.clientY && e.clientY <= rect.bottom) {
                iframe.focus();
              }
            }
          } catch {}
        };

        document.addEventListener('touchstart', handleTouchEvent, { passive: true });
        document.addEventListener('touchend', handleTouchEvent, { passive: true });
        document.addEventListener('click', handleClickEvent, { passive: true });
        
        return () => {
          document.removeEventListener('touchstart', handleTouchEvent);
          document.removeEventListener('touchend', handleTouchEvent);
          document.removeEventListener('click', handleClickEvent);
        };
      }

      // Preconnect to the game host to speed up loading
      try {
        const u = new URL(gameDetails?.url || '#');
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = `${u.protocol}//${u.host}`;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      } catch (_) {}

      // Hide any existing ad layers and keep hiding newly injected ones while modal is open
      const adSelectors = [
        'ins.adsbygoogle', '.adsbygoogle', '[id^="aswift_"]', '[id*="google_ads"]',
        'iframe[src*="googlesyndication"]', 'iframe[src*="doubleclick"]', 'iframe[src*="/ads"]',
        'div[style*="z-index: 2147483647"]', 'body > ins[style*="position: fixed"]',
      ];
      const hideExistingAds = () => {
        const nodes = document.querySelectorAll(adSelectors.join(','));
        hiddenAdsRef.current = [];
        nodes.forEach(node => {
          const el = node;
          const prev = el.style.display;
          hiddenAdsRef.current.push({ el, prev });
          el.style.display = 'none';
        });
      };
      hideExistingAds();

      observerRef.current = new MutationObserver(mutations => {
        for (const m of mutations) {
          m.addedNodes?.forEach(n => {
            if (!(n instanceof HTMLElement)) return;
            if (adSelectors.some(sel => n.matches?.(sel)) || n.querySelector?.(adSelectors.join(','))) {
              try {
                if (n instanceof HTMLElement) n.style.display = 'none';
                n.querySelectorAll?.('*').forEach(c => { if (c instanceof HTMLElement) c.style.display = 'none'; });
              } catch {}
            }
          });
        }
      });
      observerRef.current.observe(document.body, { childList: true, subtree: true });

      // Try to lock to landscape for landscape-first games on supported browsers
      try {
        if (prefersLandscape && screen.orientation && screen.orientation.lock) {
          screen.orientation.lock('landscape').catch(() => {});
        }
      } catch {}
    } else {
      document.body.classList.remove('overflow-hidden');
      document.body.classList.remove('modal-open');
      // restore hidden ads if any
      hiddenAdsRef.current.forEach(({ el, prev }) => { try { el.style.display = prev; } catch {} });
      hiddenAdsRef.current = [];
      observerRef.current?.disconnect?.();
      
      // Clean up mobile touch interval
      if (iframeRef.current?._touchInterval) {
        clearInterval(iframeRef.current._touchInterval);
        iframeRef.current._touchInterval = null;
      }
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
      document.body.classList.remove('modal-open');
      hiddenAdsRef.current.forEach(({ el, prev }) => { try { el.style.display = prev; } catch {} });
      hiddenAdsRef.current = [];
      observerRef.current?.disconnect?.();
      // Clean up error listeners
      window.removeEventListener('error', handleConsoleError);
      window.removeEventListener('unhandledrejection', handleConsoleError);
    };
  }, [showIframe]);

  return (
    <div
      className={`min-h-screen -mt-20 text-white bg-[url(https://pokiigame.com/_next/static/media/footer.5bdee055.jpg)] h-auto bg-no-repeat bg-fixed overflow-x-hidden`}
    >
      <div className="py-20  px-[20.2rem]  max-lg:px-5 max-md:px-0">
        <div className="relative flex justify-between items-center sm:border-transparent  max-md:flex-col max-lg:gap-10 max-xl:gap-4 max-sm:!gap-0">
          <Image
            src={gameDetails?.thumb || "/BlogCafe_Logo.svg"}
            alt="background-poster"
            className="absolute inset-0 w-full h-[580px] max-xl:h-[520px] max-lg:h-[460px] max-md:h-[360px] max-sm:h-[300px] object-cover rounded-[20px] max-sm:rounded-none"
            width={600}
            height={600}
          />
          <div className="absolute inset-0 h-[580px] max-xl:h-[520px] max-lg:h-[460px] max-md:h-[360px] max-sm:h-[300px] rounded-[20px] max-sm:rounded-none bg-[linear-gradient(180deg,rgba(2,12,23,0.2)_0%,rgba(2,12,23,0.75)_55%,rgba(2,12,23,0.95)_100%)]"></div>

          <div className="relative z-[5] w-full py-24 max-md:py-6 flex justify-center items-center flex-col">
            <h1 className="text-[56px] max-xl:text-[44px] max-md:text-[32px] font-extrabold text-center tracking-wide mb-3">
              <span className="bg-gradient-to-r from-[#DCF836] via-white to-[#DCF836] bg-clip-text text-transparent" style={{ backgroundSize: '200% 200%', animation: 'shine 6s linear infinite' }}>
              {gameDetails?.title || name}
              </span>
            </h1>
            <div className="rounded-[22px] border border-[rgba(220,248,54,0.25)] bg-[rgba(7,18,28,0.55)] backdrop-blur-md p-4 flex flex-col items-center gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
            <Image
              src={gameDetails?.thumb || "/BlogCafe_Logo.svg"}
                alt="game-poster"
                className="w-[200px] h-[200px] max-md:h-[160px] max-md:w-[160px] max-sm:h-[130px] max-sm:w-[150px] rounded-[16px] transition-transform duration-500 will-change-transform hover:rotate-1 hover:scale-[1.02]"
                width={200}
                height={200}
            />
            <button
              onClick={() => setShowIframe(true)}
                className="relative px-8 py-3 rounded-[60px] font-semibold bg-[#DCF836] text-black hover:bg-[#c4e030] transition-colors cursor-pointer"
            >
              PLAY GAME
                <span className="absolute inset-0 rounded-[60px]" style={{ boxShadow: '0 0 0 0 rgba(220,248,54,0.35)', animation: 'ring 2.4s ease-in-out infinite' }} />
            </button>
            </div>
            <div className="pointer-events-none absolute inset-0 -z-0">
              <span className="absolute left-[12%] top-[20%] w-2 h-2 rounded-full bg-[#DCF836] opacity-70" style={{ animation: 'float1 8s ease-in-out infinite' }} />
              <span className="absolute right-[18%] top-[30%] w-2 h-2 rounded-full bg-[#7db3ff] opacity-70" style={{ animation: 'float2 10s ease-in-out infinite' }} />
              <span className="absolute left-[45%] bottom-[18%] w-2 h-2 rounded-full bg-white opacity-70" style={{ animation: 'float3 9s ease-in-out infinite' }} />
            </div>
            {/* Iframe Modal */}
            {showIframe && (
              <div className="fixed top-0 left-0 z-[9999] w-full h-full bg-black/90 backdrop-blur-sm flex justify-center items-center game-modal-container">
                <div ref={modalContainerRef} className="relative w-[100%] h-[100%] max-w-full">
                  {/* ambient theme orbs removed in modal to prevent overlap during gameplay */}

                  {/* bottom-left glow logo */}
                  <div className="pointer-events-none absolute left-3 bottom-3 z-[30] flex items-center gap-2">
                    <Image src="/BlogCafe_Logo.svg" alt="Blogcafeai" width={56} height={36} className="h-9 w-auto rounded-md shadow-[0_0_20px_rgba(220,248,54,0.45)] animate-[glowPulse_2.2s_ease-in-out_infinite]" />
                  </div>

                  {/* bottom-right horizontal site tag (hidden on mobile) */}
                  <div className="hidden md:block pointer-events-none absolute right-3 bottom-3 z-[30]">
                    <div className="px-3 py-1 rounded-full border border-[#DCF836] text-[#DCF836] text-xs font-semibold tracking-wider bg-[rgba(7,18,28,0.45)] shadow-[0_0_16px_rgba(220,248,54,0.35)] animate-[tagSlideIn_650ms_ease-out_1,tagFloat_6s_ease-in-out_infinite_800ms]">
                      Blogcafeai.com
                    </div>
                  </div>

                  {/* Loading overlay */}
                  {!iframeLoaded && (
                    <div className="absolute inset-0 z-[15] flex flex-col items-center justify-center gap-4">
                      <div className="w-[200px] h-[10px] rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full w-1/3 bg-[#DCF836] animate-[barSlide_1.2s_linear_infinite]" />
                      </div>
                      <div className="text-white/80 text-sm">
                        {isMobile ? 'Preparing mobile game...' : 'Loading game…'}
                      </div>
                      {isMobile && (
                        <div className="text-white/60 text-xs text-center max-w-xs px-4">
                          Tap anywhere to activate game controls
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rotate guidance for landscape-first games on portrait */}
                  {prefersLandscape && isPortrait && (
                    <div className="absolute inset-0 z-[25] flex flex-col items-center justify-center gap-3 bg-black/60 text-white text-center px-6">
                      <div className="text-lg font-semibold">Rotate your device</div>
                      <div className="text-white/80 text-sm max-w-sm">This game plays best in landscape. Rotate your phone for full controls.</div>
                      <button
                        onClick={() => {
                          try { screen.orientation?.lock?.('landscape'); } catch {}
                        }}
                        className="mt-2 px-4 py-2 rounded-full bg-[#DCF836] text-black text-sm font-semibold active:scale-95"
                      >
                        Try landscape now
                      </button>
                    </div>
                  )}

                  <iframe
                    key={`game-${retryCount}`}
                    ref={iframeRef}
                    src={gameDetails?.url || "#"}
                    className={`relative z-[10] w-full h-full rounded-none ${isMobile ? 'mobile-game-iframe' : ''}`}
                    allow="accelerometer; autoplay; clipboard-read; clipboard-write; encrypted-media; fullscreen; gamepad; gyroscope; picture-in-picture; xr-spatial-tracking"
                    allowFullScreen
                    loading="eager"
                    webkitallowfullscreen="true"
                    mozallowfullscreen="true"
                    playsInline
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-top-navigation-by-user-activation"
                    onLoad={() => {
                      setIframeLoaded(true);
                      setGameError(null);
                      setGameReady(true);
                      
                      // Mobile-specific optimizations
                      if (isMobile) {
                        // Prevent scroll bounce on iOS
                        document.body.style.overscrollBehavior = 'none';
                        document.body.style.webkitOverflowScrolling = 'touch';
                        
                        // Optimize touch handling
                        try {
                          iframeRef.current?.style?.setProperty('touch-action', 'manipulation', 'important');
                          iframeRef.current?.style?.setProperty('-webkit-touch-callout', 'none', 'important');
                          iframeRef.current?.style?.setProperty('-webkit-user-select', 'none', 'important');
                        } catch {}
                        
                        // Ensure all interactive elements are touchable
                        const makeElementsTouchable = () => {
                          try {
                            const iframe = iframeRef.current;
                            if (iframe && iframe.contentDocument) {
                              const doc = iframe.contentDocument;
                              const allElements = doc.querySelectorAll('*');
                              allElements.forEach(el => {
                                el.style.pointerEvents = 'auto';
                                el.style.touchAction = 'manipulation';
                                el.style.webkitTouchCallout = 'auto';
                                el.style.webkitUserSelect = 'auto';
                                el.style.userSelect = 'auto';
                              });
                              
                              // Specifically target buttons and clickable elements
                              const clickableElements = doc.querySelectorAll('button, [role="button"], a, input, select, textarea, [onclick], div[style*="cursor: pointer"]');
                              clickableElements.forEach(btn => {
                                btn.style.pointerEvents = 'auto';
                                btn.style.touchAction = 'manipulation';
                                btn.style.webkitTouchCallout = 'auto';
                                btn.style.minHeight = '44px';
                                btn.style.minWidth = '44px';
                                btn.style.cursor = 'pointer';
                              });
                            }
                          } catch {}
                        };
                        
                        // Run immediately and then every 2 seconds
                        makeElementsTouchable();
                        const interval = setInterval(makeElementsTouchable, 2000);
                        
                        // Store interval for cleanup
                        iframeRef.current._touchInterval = interval;
                      }
                      
                      try {
                        // Give the iframe focus for keyboard/touch controls
                        iframeRef.current?.contentWindow?.focus?.();
                      } catch {}
                      
                      try {
                        // Best-effort fullscreen request on the container so overlay controls remain visible
                        const el = modalContainerRef.current;
                        if (el && document.fullscreenElement == null) {
                          const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
                          if (typeof req === 'function') req.call(el);
                        }
                      } catch {}
                    }}
                    onError={() => {
                      setGameError('Failed to load game. Please try again.');
                      setIframeLoaded(true);
                    }}
                  />

                  {/* Game Error Display */}
                  {gameError && (
                    <div className="absolute inset-0 z-[30] flex flex-col items-center justify-center bg-black/90 text-white text-center p-6 game-error-overlay">
                      <div className="bg-red-600/20 border border-red-500/50 rounded-lg p-6 max-w-md">
                        <h3 className="text-lg font-semibold mb-3 text-red-300">Game Error</h3>
                        <p className="text-sm mb-4 text-red-200">{gameError}</p>
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={() => {
                              setGameError(null);
                              setRetryCount(prev => prev + 1);
                              setIframeLoaded(false);
                            }}
                            className="px-4 py-2 bg-[#DCF836] text-black rounded-lg font-semibold hover:bg-[#c4e030] transition-colors retry-button"
                          >
                            Retry Game
                          </button>
                          <button
                            onClick={handleCloseModal}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-500 transition-colors"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* One-tap activation overlay for mobile browsers (autoplay/input focus policy) */}
                  {needsTap && !gameError && (
                    <div className="absolute inset-0 z-[26] flex flex-col items-center justify-center bg-black/20">
                      <div className="text-center text-white p-6">
                        <div className="text-lg font-semibold mb-2">Game Ready!</div>
                        <div className="text-sm text-white/80 mb-4">Tap anywhere to start playing</div>
                        <button
                          onClick={() => {
                            setNeedsTap(false);
                            setGameReady(true);
                            try { iframeRef.current?.contentWindow?.focus?.(); } catch {}
                          }}
                          className="px-6 py-3 bg-[#DCF836] text-black rounded-full font-semibold active:scale-95 transition-transform"
                          aria-label="Activate game"
                        >
                          Start Game
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (typeof window !== 'undefined' && window.history.length > 1) {
                        try { router.back(); } catch { setShowIframe(false); }
                      } else {
                        setShowIframe(false);
                      }
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (typeof window !== 'undefined' && window.history.length > 1) {
                        try { router.back(); } catch { setShowIframe(false); }
                      } else {
                        setShowIframe(false);
                      }
                    }}
                    aria-label="Close game"
                    className="absolute z-[10000] pointer-events-auto cursor-pointer top-4 right-4 bg-red-600 text-white w-10 h-10 flex justify-center items-center rounded-full text-base shadow-lg active:scale-95"
                    style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                  >
                    <IoClose />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* <div className="game-detail">
          <div className="game-ad">
            <Script id="game-detail-ad-config" strategy="afterInteractive">
              {`
            atOptions = {
              'key': '33c38de2503eaee4251a5962d435100d',
              'format': 'iframe',
              'height': 300,
              'width': 160,
              'params': {}
            };
          `}
            </Script>
            <Script
              strategy="afterInteractive"
              src="//www.highperformanceformat.com/33c38de2503eaee4251a5962d435100d/invoke.js"
            />
          </div>
        </div> */}
        {/* html */}

        <div className="max-lg:px-5 mt-8 grid grid-cols-1 gap-6">
          <div className="rounded-2xl border border-[rgba(220,248,54,0.18)] bg-[rgba(7,18,28,0.55)] p-5">
            <h2 className="text-2xl font-semibold text-[#DCF836] mb-3">About this game</h2>
            <div
              dangerouslySetInnerHTML={{ __html: gameDetails?.description || "" }}
              className="text-white/95 text-lg leading-relaxed"
            />
        </div>
          <div className="rounded-2xl border border-[rgba(220,248,54,0.18)] bg-[rgba(7,18,28,0.55)] p-5">
            <h2 className="text-2xl font-semibold text-[#DCF836] mb-3">Instructions</h2>
            <div
              dangerouslySetInnerHTML={{ __html: gameDetails?.instructions || "" }}
              className="text-white/95 text-lg leading-relaxed"
            />
          </div>
        </div>

        <div className="flex justify-start items-center flex-wrap gap-3 mt-8 max-lg:px-5">
          {(Array.isArray(gameDetails?.tags) ? gameDetails.tags : (typeof gameDetails?.tags === 'string' ? gameDetails.tags.split(/[,|]/).map(t => t.trim()).filter(Boolean) : []))
            .map((tag, index) => (
            <div
              key={index}
              className="px-4 py-1 rounded-[16px] border border-[rgba(220,248,54,0.25)] text-[#DCF836] bg-[rgba(7,18,28,0.45)]"
            >
              {tag}
            </div>
          ))}
        </div>
        <style jsx>{`
        @keyframes shine {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes ring {
          0% { box-shadow: 0 0 0 0 rgba(220,248,54,0.35); opacity: 1; }
          100% { box-shadow: 0 0 0 22px rgba(220,248,54,0.0); opacity: 0; }
        }
        @keyframes float1 { 0%, 100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(6px, -10px, 0); } }
        @keyframes float2 { 0%, 100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(-8px, 6px, 0); } }
        @keyframes float3 { 0%, 100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(5px, 8px, 0); } }
        @keyframes glowPulse { 0%,100% { filter: drop-shadow(0 0 4px rgba(220,248,54,0.35)); } 50% { filter: drop-shadow(0 0 12px rgba(220,248,54,0.75)); } }
        @keyframes orbDrift1 { 0%,100% { transform: translate(0,0) scale(1); opacity: .28; } 50% { transform: translate(8%, -6%) scale(1.05); opacity: .42; } }
        @keyframes orbDrift2 { 0%,100% { transform: translate(0,0) scale(1); opacity: .24; } 50% { transform: translate(-6%, 8%) scale(1.08); opacity: .38; } }
        @keyframes orbDrift3 { 0%,100% { transform: translate(0,0) scale(1); opacity: .22; } 50% { transform: translate(4%, -4%) scale(1.04); opacity: .32; } }
        @keyframes tagFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes tagSlideIn { 0% { transform: translateX(12px); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
        @keyframes barSlide { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }
        .orb { position: absolute; border-radius: 9999px; filter: blur(28px); }
        .orb.o1 { left: -60px; top: -40px; width: 300px; height: 300px; background: #1f3a5a; animation: orbDrift1 22s ease-in-out infinite; }
        .orb.o2 { right: -80px; bottom: -60px; width: 380px; height: 380px; background: #2a5e9a; animation: orbDrift2 26s ease-in-out infinite; }
        .orb.o3 { left: 35%; top: 20%; width: 200px; height: 200px; background: #0e2236; animation: orbDrift3 24s ease-in-out infinite; }
        `}</style>
      </div>
    </div>
  );
}
