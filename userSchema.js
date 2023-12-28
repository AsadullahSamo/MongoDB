db.createCollection("users", {
    validator: {
        $jsonSchema: {
            bsonType: "object",            // Document type which must be an object
            required: ["name", "email", "address"],    // Required fields
            properties: {                  // Field validation
                name: {
                    bsonType: "string",    // Field type
                    description: "must be a string and is required"
                },
                email: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                address: {
                    bsonType: "object",
                    description: "must be a object and is required",
                    properties: {
                        street: {
                            bsonType: "string",
                        },
                        city: {
                            bsonType: "string",
                        },
                        country: {
                            bsonType: "string",
                        }
                    }
                }
            }
        }
    }
})