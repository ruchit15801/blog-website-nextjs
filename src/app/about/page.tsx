import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
    return (
        <>
            <Navbar/>
            <div className="mx-auto max-w-7xl px-4 py-12">
                <div className="mb-6 text-sm text-gray-500">
                    <Link href="/">Home</Link> &gt; <span> About</span>
                </div>
                {/* Main Section */}
                <section className="mb-12 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                        Hey,{" "}
                        <span className="text-white px-3 py-1 rounded-md"
                            style={{
                                background: "linear-gradient(180deg, #9895ff 0%, #514dcc 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                display: "inline-block",
                            }}>Wonderful</span>{" "}
                        to Meet You
                    </h1>
                </section>

                {/* Image Section */}
                <section className="flex gap-4 mb-12">
                    <div className="flex-1 relative" style={{ flexBasis: "40%", height: "400px" }}>
                        <Image
                            src="/images/about.webp"
                            alt="Image 1"
                            fill
                            className="rounded-xl object-cover"
                        />
                    </div>
                    <div className="flex-1 relative" style={{ flexBasis: "25%", height: "400px" }}>
                        <Image
                            src="/images/about1.webp"
                            alt="Image 2"
                            fill
                            className="rounded-xl object-cover"
                        />
                    </div>
                    <div className="flex-1 relative" style={{ flexBasis: "35%", height: "400px" }}>
                        <Image
                            src="/images/about2.webp"
                            alt="Image 3"
                            fill
                            className="rounded-xl object-cover"
                        />
                    </div>
                </section>

                <div className="flex flex-col items-center mx-auto px-4 py-8 space-y-6">
                    <h4
                        className="text-center"
                        style={{
                            color: "#29294b",
                            maxWidth: "640px",
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            lineHeight: 1.5,
                            wordWrap: "break-word",
                        }}
                    >
                        By 2016, we began to see the fruits of our labor as word spread about our work, leading us to our first major client — a regional retail chain. This was a pivotal moment for us, as it allowed us to hire our first employee. Emma stepped up to lead user experience design, while Liam and I focused on coding and project management.
                    </h4>
                    <h4
                        className="text-center"
                        style={{
                            color: "#29294b",
                            maxWidth: "640px",
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            lineHeight: 1.5,
                            wordWrap: "break-word",
                        }}
                    >
                        As we gathered to reflect on our incredible journey, hosting a community event to showcase local tech talent felt like the perfect way to give back and inspire the next generation of innovators. It reminded us that with passion, collaboration, and a bit of code, anything is possible.
                    </h4>
                </div>

                <section className="mx-auto max-w-6xl px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Box 1 */}
                        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow">
                            <div className="text-4xl text-indigo-500">
                                🚀
                            </div>
                            <h3 className="text-xl font-bold" style={{ color: '#292981', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-.04em' }}>Empowering Innovation</h3>
                            <p className="text-gray-600 leading-relaxed" style={{ fontWeight: 400, lineHeight: 1.55, color: "#696981" }}>
                                We consistently push the boundaries of technology, leading to unique and effective solutions.
                            </p>
                        </div>

                        {/* Box 2 */}
                        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow">
                            <div className="text-4xl text-indigo-500">
                                💡
                            </div>
                            <h3 className="text-xl font-bold text-gray-800" style={{ color: '#292981', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-.04em' }}>Community-Centric Approach</h3>
                            <p className="text-gray-600 leading-relaxed" style={{ fontWeight: 400, lineHeight: 1.55, color: "#696981" }}>
                                Our commitment to giving back not only enhances their reputation but also strengthens ties within the community.
                            </p>
                        </div>

                        {/* Box 3 */}
                        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow">
                            <div className="text-4xl text-indigo-500">
                                🌐
                            </div>
                            <h3 className="text-xl font-bold text-gray-800" style={{ color: '#292981', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-.04em' }}>Flexibility & Adaptability</h3>
                            <p className="text-gray-600 leading-relaxed" style={{ fontWeight: 400, lineHeight: 1.55, color: "#696981" }}>
                                Our team agile work environment allows them to quickly adapt to changing market needs.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
            <Footer/>
        </>
    );
}
