

import React ,  { useState } from "react"

export default function Profile() {
  const [activeTab, setActiveTab] = useState("portfolio")
  const [isEditing, setIsEditing] = useState(false)
  const isOwner = true // Simulate ownership check

  const [user, setUser] = useState({
    name: "Alex Johnson",
    username: "@alexjohnson",
    role: "Senior Frontend Developer",
    location: "San Francisco, CA",
    joined: "Joined March 2020",
    bio: "Frontend developer with 5+ years of experience building responsive web applications. Passionate about user experience and clean code.",
    stats: {
      projects: 24,
      followers: 1204,
      following: 86,
    },
    skills: ["React", "JavaScript", "Tailwind CSS", "Node.js", "GraphQL", "UI/UX Design"],
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUser((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Material Icons Font */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Profile Header */}
        <div className="relative mb-8">
          {/* Cover Image */}
          <div className="h-48 w-full rounded-t-xl bg-gradient-to-r from-blue-500 to-purple-600"></div>

          {/* Profile Image */}
          <div className="absolute -bottom-16 left-4 sm:left-8">
            <div className="h-32 w-32 rounded-full border-4 border-white bg-white">
              <img
                src="/placeholder.svg?height=128&width=128"
                alt="Profile"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            {isOwner && (
              <button
                onClick={() => setIsEditing((prev) => !prev)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            )}
            <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
              Follow
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-16 sm:mt-20">
          <div className="mb-6">
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleInputChange}
                  className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 text-lg font-bold"
                />
                <textarea
                  name="bio"
                  value={user.bio}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-gray-500">{user.username}</p>
                <p className="mt-2">{user.bio}</p>
              </>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex items-center text-sm text-gray-500">
                <span className="material-icons mr-1 text-base">work</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="role"
                    value={user.role}
                    onChange={handleInputChange}
                    className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                  />
                ) : (
                  user.role
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="material-icons mr-1 text-base">location_on</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={user.location}
                    onChange={handleInputChange}
                    className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                  />
                ) : (
                  user.location
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="material-icons mr-1 text-base">calendar_today</span>
                {user.joined}
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-4 flex space-x-3">
              <a href="#" className="rounded-full bg-gray-100 p-2 hover:bg-gray-200">
                <span className="material-icons text-gray-700">twitter</span>
              </a>
              <a href="#" className="rounded-full bg-gray-100 p-2 hover:bg-gray-200">
                <span className="material-icons text-gray-700">code</span>
              </a>
              <a href="#" className="rounded-full bg-gray-100 p-2 hover:bg-gray-200">
                <span className="material-icons text-gray-700">linkedin</span>
              </a>
              <a href="#" className="rounded-full bg-gray-100 p-2 hover:bg-gray-200">
                <span className="material-icons text-gray-700">email</span>
              </a>
              <a href="#" className="rounded-full bg-gray-100 p-2 hover:bg-gray-200">
                <span className="material-icons text-gray-700">link</span>
              </a>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <button
              onClick={() => setIsEditing(false)}
              className="mt-4 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
            >
              Save Changes
            </button>
          )}

          {/* Stats */}
          <div className="mb-8 flex space-x-6">
            <div className="text-center">
              <div className="text-xl font-bold">{user.stats.projects}</div>
              <div className="text-sm text-gray-500">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{user.stats.followers}</div>
              <div className="text-sm text-gray-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{user.stats.following}</div>
              <div className="text-sm text-gray-500">Following</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="w-full">
            <div className="grid w-full grid-cols-4 border-b">
              {["portfolio", "skills", "experience", "about"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 text-center capitalize ${
                    activeTab === tab
                      ? "border-b-2 border-blue-600 font-medium text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {/* Portfolio Tab */}
              {activeTab === "portfolio" && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                      <div className="h-40 bg-gray-200">
                        <img
                          src={`/placeholder.svg?height=160&width=320&text=Project ${item}`}
                          alt={`Project ${item}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium">Project {item}</h3>
                        <p className="text-sm text-gray-500">A short description of this project</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills Tab */}
              {activeTab === "skills" && (
                <div>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill) => (
                      <span key={skill} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <div className="mb-1 flex justify-between">
                        <span className="text-sm font-medium">React</span>
                        <span className="text-sm text-gray-500">95%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div className="h-2 rounded-full bg-blue-600" style={{ width: "95%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex justify-between">
                        <span className="text-sm font-medium">JavaScript</span>
                        <span className="text-sm text-gray-500">90%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div className="h-2 rounded-full bg-blue-600" style={{ width: "90%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex justify-between">
                        <span className="text-sm font-medium">Tailwind CSS</span>
                        <span className="text-sm text-gray-500">85%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div className="h-2 rounded-full bg-blue-600" style={{ width: "85%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex justify-between">
                        <span className="text-sm font-medium">Node.js</span>
                        <span className="text-sm text-gray-500">75%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div className="h-2 rounded-full bg-blue-600" style={{ width: "75%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Experience Tab */}
              {activeTab === "experience" && (
                <div className="space-y-6">
                  <div className="relative border-l border-gray-200 pl-6">
                    <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-blue-500"></div>
                    <h3 className="text-lg font-semibold">Senior Frontend Developer</h3>
                    <p className="text-sm text-gray-500">TechCorp Inc. • 2020 - Present</p>
                    <p className="mt-2">
                      Led the frontend development team in building responsive web applications. Implemented modern
                      React patterns and optimized performance.
                    </p>
                  </div>

                  <div className="relative border-l border-gray-200 pl-6">
                    <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-300"></div>
                    <h3 className="text-lg font-semibold">Frontend Developer</h3>
                    <p className="text-sm text-gray-500">WebSolutions • 2018 - 2020</p>
                    <p className="mt-2">
                      Developed and maintained client websites and web applications. Collaborated with designers to
                      implement pixel-perfect UIs.
                    </p>
                  </div>

                  <div className="relative border-l border-gray-200 pl-6">
                    <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-300"></div>
                    <h3 className="text-lg font-semibold">Junior Developer</h3>
                    <p className="text-sm text-gray-500">StartupX • 2016 - 2018</p>
                    <p className="mt-2">
                      Assisted in developing frontend features for the company's main product. Learned and implemented
                      best practices in web development.
                    </p>
                  </div>
                </div>
              )}

              {/* About Tab */}
              {activeTab === "about" && (
                <div className="space-y-4">
                  <p>
                    I'm a passionate frontend developer with a focus on creating intuitive and performant user
                    interfaces. With over 5 years of experience in the industry, I've worked on a variety of projects
                    from small business websites to large-scale web applications.
                  </p>

                  <p>
                    My expertise lies in React and its ecosystem, but I'm always eager to learn new technologies and
                    approaches. I believe in writing clean, maintainable code and creating accessible user experiences.
                  </p>

                  <p>
                    When I'm not coding, you can find me hiking, reading sci-fi novels, or experimenting with new
                    recipes in the kitchen.
                  </p>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold">Contact Information</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <span className="material-icons mr-2 text-gray-500">email</span>
                        <span>alex.johnson@example.com</span>
                      </div>
                      <div className="flex items-center">
                        <span className="material-icons mr-2 text-gray-500">location_on</span>
                        <span>San Francisco, California</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

