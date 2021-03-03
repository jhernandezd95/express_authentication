const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Authentication Express API with Swagger",
        version: "0.1.0",
        description:
          "This is a basic authentication made with Express and documented with Swagger",
        license: {
          name: "",
          url: "",
        },
        contact: {
          name: "",
          url: "",
          email: "",
        },
      },
      servers: [
        {
          url: "http://localhost:3000/api/",
          description: "Development server"
        },
        {
          url: "http://localhost:3000/api/",
          description: "Testing server"
        }
      ],
    },
    apis: ["src/routes/*.js"],
};

module.exports = {
    options
}