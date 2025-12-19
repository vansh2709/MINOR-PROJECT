import {
  FaYoutube,
  FaFacebook,
  FaInstagram,
  FaGithub,
  FaLinkedin
} from "react-icons/fa";

const team = [
  {
    name: "Arindam",
    github: "Arindam-c-Pathak",
    linkedin: "https://www.linkedin.com/in/arindam-chandra-pathak/",
    role: "Frontend Developer"
  },
  {
    name: "Arjun",
    github: "",
    linkedin: "",
    role: "Frontend Developer"
  },
  {
    name: "Rahul Verma",
    github: "SudoRV",
    linkedin: "https://www.linkedin.com/in/sudorv/",
    role: "Backend Developer"
  },
  {
    name: "Rituraj Kalkhudiya",
    github: "Riturajkalkhudiya",
    linkedin: "https://www.linkedin.com/in/rituraj-kalkhudiya-b32174315/",
    role: "Database Developer"
  },
  {
    name: "Vansh Verma",
    github: "vansh2709",
    linkedin: "https://www.linkedin.com/in/vansh-verma-ab318b304/",
    role: "Database Developer"
  },
];

export default function Footer() {
  return (
    <footer className="bg-green-100 text-gray-700 border-t rounded-xl mt-4">
      {/* Top Section */}
      <div className="bg-green-100 rounded-xl">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Institutes */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-[#2b2c2b] mb-2">
              Institutes
            </h3>
            <div className="w-10 h-[3px] bg-blue-600 rounded-full mb-4" />

            <ul className="space-y-3 text-sm">
              <li className="list-none">
                <a
                  href="https://uktech.ac.in/en"
                  target="_blank"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                >
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  Uttarakhand Technical University
                </a>
              </li>
              <li className="list-none">
                <a
                  href="https://ittanakpur.ac.in/"
                  target="_blank"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                >
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  Institute of Technology, Tanakpur
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-[#2b2c2b] mb-2">
              Quick Links
            </h3>
            <div className="w-10 h-[3px] bg-blue-600 rounded-full mb-4" />

            <ul className="space-y-3 text-sm text-gray-600">
              {["Terms & Conditions", "Contact", "Exit"].map((item, i) => (
                <li className="list-none" key={i}>
                  <a
                    href="#"
                    className="hover:text-blue-600 transition flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-[#2b2c2b] mb-2">
              Follow Us
            </h3>
            <div className="w-10 h-[3px] bg-blue-600 rounded-full mb-5" />

            <div className="flex gap-4">
              {[
                { icon: <FaYoutube />, hover: "hover:text-red-600" },
                { icon: <FaFacebook />, hover: "hover:text-blue-600" },
                { icon: <FaInstagram />, hover: "hover:text-pink-500" },
                { icon: <FaLinkedin />, hover: "hover:text-blue-500" },
                { icon: <FaGithub />, hover: "hover:text-black" }
              ].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className={`
              w-11 h-11 flex items-center justify-center
              rounded-md border border-gray-300
              text-[#2b2c2b] text-[26px]
              transition-all duration-300
              hover:scale-110 hover:-translate-y-1
              hover:shadow-md
              ${item.hover}
            `}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>


      {/* Credits */}
      <div className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h3 className="text-center text-gray-900 text-lg font-semibold mb-8">
            Project Credits
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {team.map((member, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center gap-2"
              >
                {member.github ? (
                  <img
                    src={`https://github.com/${member.github}.png`}
                    alt={member.name}
                    className="w-16 h-16 rounded-full border border-gray-300 object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                    NA
                  </div>
                )}

                <p className="text-sm font-medium text-gray-900">
                  {member.name}
                </p>

                <p className="text-sm font-bold text-gray-900">
                  {member.role}
                </p>

                <div className="flex gap-3 text-sm text-gray-600">
                  {member.github && (
                    <a
                      href={`https://github.com/${member.github}`}
                      target="_blank"
                      className="hover:text-gray-900"
                    >
                      <FaGithub size={26} color="#2b2c2b" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      className="hover:text-blue-600"
                    >
                      <FaLinkedin size={26} color="#2b2c2b" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-xs text-gray-500 py-4 border-t bg-gray-50">
        © {new Date().getFullYear()} Academic Project • Built with ❤️ by Team
      </div>
    </footer>
  );
}
