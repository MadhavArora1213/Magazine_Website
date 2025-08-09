import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const sidebarLinks = [
  { label: "Who We Are", to: "#who-we-are" },
  { label: "All About MAGAZINE", to: "#all-about-magazine" },
  { label: "Editorial Policy", to: "#editorial-policy" },
  { label: "AI & Other Technology", to: "#ai-other-tech" },
  { label: "Our Values", to: "#our-values" },
  { label: "Community Guidelines", to: "#community-guidelines" },
  { label: "MAGAZINE Leadership", to: "#leadership" },
  { label: "Editorial Staff", to: "#editorial-staff" },
  { label: "About Our Company", to: "#about-company" },
  { label: "Contact Us", to: "#contact-us" },
  { label: "Engage with Us", to: "#engage-with-us" },
  { label: "Work with Us", to: "#work-with-us" },
  { label: "Advertise with Us", to: "#advertise-with-us" },
];

// Utility to get current section from scroll
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    function onScroll() {
      let found = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id.replace("#", ""));
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) found = id;
        }
      }
      setActive(found);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids]);
  return active;
}

const AboutPage = () => {
  const ids = sidebarLinks.map((l) => l.to);
  const activeSection = useActiveSection(ids);

  return (
    <div className="bg-[#e3e7f7] min-h-screen">
      <main className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-10">
        {/* Sticky Sidebar */}
        <aside className="bg-white border-4 border-[#162048] rounded-2xl p-6 w-full md:w-1/3 mb-8 md:mb-0 md:sticky md:top-24 h-fit self-start shadow-lg">
          <h3 className="font-extrabold text-2xl text-[#162048] mb-6 tracking-wide">
            In This Article
          </h3>
          <ul className="space-y-3">
            {sidebarLinks.map((item, idx) => (
              <li key={idx}>
                <a
                  href={item.to}
                  className={`flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200
                    ${
                      activeSection === item.to
                        ? "bg-[#162048] text-white font-extrabold shadow-lg border-2 border-[#162048]"
                        : "text-[#162048] hover:bg-[#162048]/10 hover:text-[#1a1a1a] border-2 border-transparent"
                    }`}
                  style={{
                    boxShadow:
                      activeSection === item.to
                        ? "0 2px 8px rgba(22,32,72,0.12)"
                        : undefined,
                  }}
                >
                  <span className="mr-2 text-lg font-bold">
                    {activeSection === item.to ? (
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="7" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" fill="none" stroke="#162048" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="7" />
                      </svg>
                    )}
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Article Content */}
        <section className="flex-1">
          <h1 className="text-4xl font-extrabold text-[#162048] mb-8 tracking-wide border-b-4 border-[#162048] pb-4">
            About MAGAZINE
          </h1>

          <section id="who-we-are" className="mb-10 scroll-mt-32">
            <h2 className="text-2xl font-extrabold text-[#162048] mb-4 tracking-wide">
              Who We Are
            </h2>
            <p className="text-lg text-[#1a1a1a] mb-4 leading-relaxed">
              MAGAZINE’s accomplished team of editors, writers, designers and
              photographers are all dedicated to our core mission: to inform,
              entertain and inspire by sharing the stories that everyone will be
              talking about. Our team is comprised of trusted experts in nearly
              every field. We’re the go-to source for news about technology,
              lifestyle, business, travel, health, entertainment and more, and we
              elevate powerful human interest stories and everyday people making a
              difference in their communities. With decades of experience and a
              true passion for the subjects we cover, our journalists believe in
              the power of storytelling to make a difference.
            </p>
          </section>

          <section id="all-about-magazine" className="mb-10 scroll-mt-32">
            <h2 className="text-2xl font-extrabold text-[#162048] mb-4 tracking-wide">
              All About MAGAZINE
            </h2>
            <p className="text-lg text-[#1a1a1a] mb-4 leading-relaxed">
              MAGAZINE delivers trustworthy news and captivating human interest
              stories, connecting you to the pulse of culture. Since our first
              issue, we have been striving to tell compelling stories about the
              people behind the issues, as opposed to just the issues themselves.
              We are your everyday escape, taking you inside the lives of
              intriguing stars, newsmakers, up-and-comers and ordinary people
              doing extraordinary things. We serve and delight you by providing
              ideas about beauty, food and style through the lens of the people
              influencing the trends. And we are a force for good by telling
              stories of hope, optimism and kindness that drive conversation and
              inspire action.
            </p>
          </section>

          <section id="editorial-policy" className="mb-10 scroll-mt-32">
            <h2 className="text-2xl font-extrabold text-[#162048] mb-4 tracking-wide">
              Editorial Policy
            </h2>
            <p className="text-lg text-[#1a1a1a] mb-4 leading-relaxed">
              If you read it on MAGAZINE, you know it is true. MAGAZINE is
              committed to accurate, fair and complete journalism. We uphold the
              highest standards of editorial integrity and transparency in all our
              content.
            </p>
            <p className="text-lg text-[#1a1a1a] mb-4">
              <Link to="#" className="text-[#162048] underline font-bold">
                Read our full Editorial Policy
              </Link>
            </p>
          </section>

          <section id="ai-other-tech" className="mb-10 scroll-mt-32">
            <h2 className="text-2xl font-extrabold text-[#162048] mb-4 tracking-wide">
              AI & Other Technology
            </h2>
            <p className="text-lg text-[#1a1a1a] mb-4 leading-relaxed">
              At MAGAZINE, we are committed to providing the highest quality
              content, created by a trusted group of human writers, reporters and
              editors with our audience in mind. It is against our guidelines to
              publish automatically generated content that has been written by AI
              tools.
            </p>
          </section>

          <section id="our-values" className="mb-10 scroll-mt-32">
            <h2 className="text-2xl font-extrabold text-[#162048] mb-4 tracking-wide">
              Our Values
            </h2>
            <p className="text-lg text-[#1a1a1a] mb-4 leading-relaxed">
              From our founding through today, MAGAZINE remains committed to
              sharing stories of ordinary people doing extraordinary things and
              extraordinary people doing ordinary things. We are dedicated to
              telling a broad spectrum of personality-driven stories that reflect
              our vast and varied audience.
            </p>
            <ul className="list-disc pl-6 text-lg text-[#1a1a1a] mb-4">
              <li>
                <strong>Accuracy:</strong> We ensure all information is correct
                and up-to-date.
              </li>
              <li>
                <strong>Fairness:</strong> We present diverse viewpoints and
                respect all voices.
              </li>
              <li>
                <strong>Transparency:</strong> We disclose sources and correct
                errors promptly.
              </li>
              <li>
                <strong>Creativity:</strong> We encourage innovative ideas and
                fresh perspectives.
              </li>
              <li>
                <strong>Community:</strong> We foster a welcoming environment for
                readers and contributors.
              </li>
            </ul>
          </section>

          <section id="community-guidelines" className="mb-10 scroll-mt-32">
            <h2 className="text-2xl font-extrabold text-[#162048] mb-4 tracking-wide">
              Community Guidelines
            </h2>
            <p className="text-lg text-[#1a1a1a] mb-4 leading-relaxed">
              Our comments section is intended to be a place where readers can
              engage in discussions about our stories. Offensive language, hate
              speech, personal attacks and/or defamatory statements are not
              allowed. Advertising or spammy content is also prohibited. Comments
              are not always available on all stories.
            </p>
            <p className="text-lg text-[#1a1a1a] mb-4 leading-relaxed">
              Comments are moderated and may be deleted without notice. Repeat
              offenders may be banned without notice. We reserve the right to
              delete comments and ban offenders at our discretion. Our decisions
              are final.
            </p>
          </section>

          <section id="leadership" className="mb-10 scroll-mt-32">
            <h2 className="text-2xl font-extrabold text-[#162048] mb-4 tracking-wide">
              MAGAZINE Leadership
            </h2>
            <p className="text-lg text-[#1a1a1a] mb-4 leading-relaxed">
              Our leadership team is committed to upholding our values and
              guiding MAGAZINE’s vision. Our editorial staff includes experienced
              journalists, subject matter experts, and creative professionals who
              work together to deliver outstanding content.
            </p>
            <ul className="list-disc pl-6 text-lg text-[#1a1a1a] mb-4">
              <li>Editor in Chief: Alex Johnson</li>
              <li>Associate General Manager: Jane Smith</li>
              <li>Executive Director, Special Projects: Mark Wilson</li>
              <li>Director of Operations and Finance: Sarah Lee</li>
              <li>Executive Editorial Director: John Doe</li>
            </ul>
          </section>

          <section id="editorial-staff" className="mb-10 scroll-mt-32">
            <h2 className="text-2xl font-extrabold text-[#162048] mb-4 tracking-wide">
              Editorial Staff
            </h2>
            <p className="text-lg text-[#1a1a1a] mb-4 leading-relaxed">
              Our editorial team includes section editors, writers, designers,
              photographers, and digital producers. Each member brings unique
              expertise and a passion for storytelling.
            </p>
            <ul className="list-disc pl-6 text-lg text-[#1a1a1a] mb-4">
              <li>Senior Editors: Technology, Lifestyle, Travel, Business, Health, Entertainment</li>
              <li>Staff Writers & Reporters</li>
              <li>Design & Photography Team</li>
              <li>Digital & Social Media Team</li>
            </ul>
          </section>

          <section id="about-company" className="mb-10 scroll-mt-32">
            <h2 className="text-2xl font-extrabold text-[#162048] mb-4 tracking-wide">
              About Our Company
            </h2>
            <p className="text-lg text-[#1a1a1a] mb-4 leading-relaxed">
              MAGAZINE is part of a family of brands committed to creating
              accurate, helpful news and information that represents and serves
              all people. From mobile to magazines, thousands trust us to help
              them make decisions, take action and find inspiration. Our brands
              include MAGAZINE, Better Living, Food & Style, and more.
            </p>
          </section>

          <section id="contact-us" className="mb-10 scroll-mt-32">
            <h2 className="text-2xl font-extrabold text-[#162048] mb-4 tracking-wide">
              Contact Us
            </h2>
            <p className="text-lg text-[#1a1a1a] mb-4 leading-relaxed">
              Do you have something you'd like to let us know? Whether you have
              an idea to share or a lead we should pursue, we look forward to
              hearing from you:{" "}
              <a
                href="mailto:tips@magazine.com"
                className="text-[#162048] underline font-bold"
              >
                tips@magazine.com
              </a>
              .
            </p>
            <p className="text-lg text-[#1a1a1a] mb-4 leading-relaxed">
              Send feedback on content to{" "}
              <a
                href="mailto:feedback@magazine.com"
                className="text-[#162048] underline font-bold"
              >
                feedback@magazine.com
              </a>
              .
            </p>
            <p className="text-lg text-[#1a1a1a] mb-4 leading-relaxed">
              For press inquiries, email us at{" "}
              <a
                href="mailto:press@magazine.com"
                className="text-[#162048] underline font-bold"
              >
                press@magazine.com
              </a>
              .
            </p>
            <p className="text-lg text-[#1a1a1a] mb-4 leading-relaxed">
              If you would rather send us a letter, you can reach us at 225
              Liberty Street, 7th Floor, New York, NY 10281.
            </p>
          </section>

          <section id="engage-with-us" className="mb-10 scroll-mt-32">
            <h2 className="text-2xl font-extrabold text-[#162048] mb-4 tracking-wide">
              Engage with Us
            </h2>
            <p className="text-lg text-[#1a1a1a] mb-4 leading-relaxed">
              MAGAZINE is everywhere you are. You can find us on Facebook,
              Instagram, Snapchat, Pinterest and TikTok.
            </p>
          </section>

          <section id="work-with-us" className="mb-10 scroll-mt-32">
            <h2 className="text-2xl font-extrabold text-[#162048] mb-4 tracking-wide">
              Work with Us
            </h2>
            <p className="text-lg text-[#1a1a1a] mb-4 leading-relaxed">
              Join our crew of top-notch reporters, editors, designers and more as
              we continue to report the latest news and human interest stories.{" "}
              <a
                href="#"
                className="text-[#162048] underline font-bold"
              >
                View job openings
              </a>
            </p>
          </section>

          <section id="advertise-with-us" className="mb-10 scroll-mt-32">
            <h2 className="text-2xl font-extrabold text-[#162048] mb-4 tracking-wide">
              Advertise with Us
            </h2>
            <p className="text-lg text-[#1a1a1a] mb-4 leading-relaxed">
              MAGAZINE offers the highest value to advertisers through a
              combination of scale, credibility and intent. Interested in
              advertising with us? Email us at{" "}
              <a
                href="mailto:ads@magazine.com"
                className="text-[#162048] underline font-bold"
              >
                ads@magazine.com
              </a>{" "}
              or check out our media kit to learn more.
            </p>
          </section>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;