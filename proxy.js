const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const path = require("path");
const { Pool } = require("pg");
const multer = require("multer");
const FormData = require("form-data");

// Enable CORS for all routes
app.use(cors());


//const API_TOKEN = "VF.DM.677f4487086ea12e377a59b7.OMz8Fc5KTGL2JJ05";
//const token = "eyJraWQiOiJjdXN0b20tb2F1dGgta2V5aWQiLCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJmcmVzaGNoYXQiLCJhdWQiOiJmcmVzaGNoYXQiLCJpYXQiOjE3MzYzODc5NjUsInNjb3BlIjoiYWdlbnQ6cmVhZCBhZ2VudDpjcmVhdGUgYWdlbnQ6dXBkYXRlIGFnZW50OmRlbGV0ZSBjb252ZXJzYXRpb246Y3JlYXRlIGNvbnZlcnNhdGlvbjpyZWFkIGNvbnZlcnNhdGlvbjp1cGRhdGUgbWVzc2FnZTpjcmVhdGUgbWVzc2FnZTpnZXQgYmlsbGluZzp1cGRhdGUgcmVwb3J0czpmZXRjaCByZXBvcnRzOmV4dHJhY3QgcmVwb3J0czpyZWFkIHJlcG9ydHM6ZXh0cmFjdDpyZWFkIGFjY291bnQ6cmVhZCBkYXNoYm9hcmQ6cmVhZCB1c2VyOnJlYWQgdXNlcjpjcmVhdGUgdXNlcjp1cGRhdGUgdXNlcjpkZWxldGUgb3V0Ym91bmRtZXNzYWdlOnNlbmQgb3V0Ym91bmRtZXNzYWdlOmdldCBtZXNzYWdpbmctY2hhbm5lbHM6bWVzc2FnZTpzZW5kIG1lc3NhZ2luZy1jaGFubmVsczptZXNzYWdlOmdldCBtZXNzYWdpbmctY2hhbm5lbHM6dGVtcGxhdGU6Y3JlYXRlIG1lc3NhZ2luZy1jaGFubmVsczp0ZW1wbGF0ZTpnZXQgZmlsdGVyaW5ib3g6cmVhZCBmaWx0ZXJpbmJveDpjb3VudDpyZWFkIHJvbGU6cmVhZCBpbWFnZTp1cGxvYWQiLCJ0eXAiOiJCZWFyZXIiLCJjbGllbnRJZCI6ImZjLTBmYzFhNzAzLWVhM2YtNGFhOC1iMTk2LWVkNzJiNWQyN2U5MiIsInN1YiI6IjRlMzMxZWQ1LTBmZGEtNDRiMC05Yzc3LWM1MDJhNWY4ZjJhZiIsImp0aSI6IjI1MjZiNTE4LWE1YTctNGI5Ny04YjNkLTA4YjNkOWY0YTFkNiIsImV4cCI6MjA1MTkyMDc2NX0.O620G19G2jcLgh5ABNMsvOJJbgDfm6Aigj6GeI8TbBw";

require('dotenv').config();



// Fetch tokens from the environment
const API_TOKEN = process.env.API_TOKEN;
const token = process.env.token;
app.use(express.static(path.join(__dirname)));

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Set up Multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


let globalFreshchatConversationId = null;

let globalFreshchat_user_id = null;

let voiceflow_session_id = null;

const pool = new Pool({
  user: "ai_user", // Database username
  host: "10.10.9.216", // Database host
  database: "chat_history_for_ai", // Database name
  password: "aipassword", // Database password
  port: 5432, // PostgreSQL port
});


app.post("/api/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    // Retrieve conversationId from the form data (or use the global if not provided)
    const conversationId =  globalFreshchatConversationId;
    console.log("Received conversationId:", conversationId);
    
    // Create a new FormData instance and append the image file
    const form = new FormData();
    form.append("image", req.file.buffer, req.file.originalname);
    
    // Prepare headers for the Freshchat image upload API call


    const headers = {
      ...form.getHeaders(),
      accept: "application/json",
      Authorization: `Bearer ${token}`, // Ensure token is defined
    };
    
    // Freshchat image upload endpoint URL
    const uploadUrl = "https://internet-807115875383812901-b33739ced734ba517388168.freshchat.com/v2/images/upload";

    // const uploadUrl = "https://internet-807115875383812901-b33739ced734ba517388168.freshchat.com/v2/files/upload"; 
    
    // Upload the image file to Freshchat using Axios
    const uploadResponse = await axios.post(uploadUrl, form, { headers });
    console.log("Image uploaded:", uploadResponse.data);
    
    const image_url = uploadResponse.data.url;


    if (!image_url) {
      return res.status(500).json({ error: "No image URL returned from Freshchat" });


    }


    const userID = voiceflow_session_id;
    const url = `https://general-runtime.voiceflow.com/state/user/${userID}/variables`;

    const options = {
      method: 'PATCH',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'Authorization': API_TOKEN, // Authorization token
      },
      data: {
        upload_image_url: image_url, // Payload to update variables
      },
    };


    const response_image = await axios(url, options);

   // console.log("Imageresponse__________ :", response_image.data);
    // Now send the image message to the conversation.
    // Construct the URL using the conversationId.
    const send_image_url = `https://internet-807115875383812901-b33739ced734ba517388168.freshchat.com/v2/conversations/${conversationId}/messages`;
    
    // Use a global user id (or get it from req.body if provided)
    const actor_id = globalFreshchat_user_id;
    
    const body_send_image = {
      actor_type: "user",
      actor_id: actor_id,
      message_type: "image",
      message_parts: [
        {
          image: {
            url: image_url
          }
        }
      ]
    };

 

    
    const headers_image = {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    };
    
    // Send the image message using Axios POST
    const imageMsgResponse = await axios.post(send_image_url, body_send_image, { headers: headers_image });
    console.log("Image message sent:", imageMsgResponse.data);
    
    // Send the final response back to the client, including both responses and the conversationId.
    res.status(200).json({
      upload: uploadResponse.data,
      imageMessage: imageMsgResponse.data,
      conversationId
    });
    
  } catch (error) {
    console.error("Error uploading image:", error.message);
    res.status(500).json({
      error: "Image upload failed",
      details: error.response ? error.response.data : error.message,
    });
  }
});




app.post('/api/update-voiceflow-variables', async (req, res) => {
  const { content, userID } = req.body;

  // Validate input
  if (!content || !userID) {
    return res.status(400).json({ error: 'Content and userID are required' });
  }
  
  // Voiceflow API URL
  const url = `https://general-runtime.voiceflow.com/state/user/${userID}/variables`;

  const options = {
    method: 'PATCH',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'Authorization': API_TOKEN, // Authorization token
    },
    data: {
      live_agent_response: content, // Payload to update variables
    },
  };

  try {
    // Make the API call to Voiceflow
    const response = await axios(url, options);
    //console.log('response______________________',response.data);
    // Send the response back to the client
    res.status(response.status).json(response.data);

  } catch (error) {
    console.error('Error updating Voiceflow variables:', error.message);

    // Send error response back to the client
    res.status(500).json({
      error: 'Failed to update Voiceflow variables',
      details: (error.response && error.response.data) || error.message,
    });
  }
});










app.post("/api/feedback", async (req, res) => {
  const { feedback, freshchat_conversation_id, feedback_append } = req.body;
  let { rating } = req.body;

  console.log("Request Body:", req.body);

  // Validate input
  if ( !freshchat_conversation_id || !feedback_append) {
    console.log("Validation Error: Missing required fields");
    return res.status(400).send({ error: "Missing required fields" });
  }


  try {
    // Insert data into the `voiceflow_data` table
    const query =
      "INSERT INTO freshchat_conversation_feedback (freshchat_conversation_id, rating, feedback) VALUES ($1, $2, $3)";
    const values = [freshchat_conversation_id, rating, feedback];
    
    await pool.query(query, values);

    res.status(200).send({
      message: "Data successfully saved to the database.",
    });
  } catch (error) {
    console.error("Error saving data to the database:", error.message);

    res.status(500).send({
      error: "Failed to save data to the database",
      details: error.message,
    });
  }
});




app.post("/api/fetch-conversation-id", async (req, res) => {
  const { userID } = req.body;

  // Validate input
  if (!userID) {
    return res.status(400).send({ error: "Missing required field: userID" });
  }

  const url = `https://general-runtime.voiceflow.com/state/user/${userID}/variables`;
  const options = {
    method: "PATCH",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: API_TOKEN, // Replace with your actual token
    },
  };

  try {
    // Make the PATCH request using Axios
    const response = await axios(url, options);

    if (response.status !== 200) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = response.data;

    // Extract freshchat_conversation_id
    const freshchatConversationId = 
  data && 
  data.attributes && 
  data.attributes.variables && 
  data.attributes.variables.freshchat_conversation_id;
  


    if (freshchatConversationId) {
      console.log("Freshchat Conversation ID:", freshchatConversationId);

      // Respond with the conversation ID
      res.status(200).send({ freshchatConversationId });
    } else {
      throw new Error("freshchat_conversation_id not found in the response.");
    }
  } catch (error) {
    console.error("Error fetching freshchat_conversation_id:", error.message);

    // Forward the error details to the client
    res.status(500).send({
      error: "Failed to fetch freshchat_conversation_id",
      details: (error.response && error.response.data) || error.message,
    });
  }
});






let globalIsWithinTimeRange = null;
app.post("/api/get-conversation-id", async (req, res) => {
  const { userId } = req.body;

  // Validate input
  if (!userId) {
    return res.status(400).send({ error: "Missing userId in request body" });
  }

  const url = `https://general-runtime.voiceflow.com/state/user/${userId}/variables`;
  voiceflow_session_id = userId;
  const options = {
    method: "PATCH",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: API_TOKEN,
    },
  };

  try {
    // Make the PATCH request
    const response = await axios(url, options);

    // Extract conversation ID and other variables from response
    const data = response.data;
    const freshchatConversationId =
      data?.attributes?.variables?.freshchat_conversation_id;
    const freshchat_user_id =
      data?.attributes?.variables?.freshchat_user_id;
    const isWithinTimeRange =
      data?.attributes?.variables?.isWithinTimeRange;

    // Set global variables
    globalFreshchatConversationId = freshchatConversationId;
    globalFreshchat_user_id = freshchat_user_id;
    globalIsWithinTimeRange = isWithinTimeRange;

    console.log("Updated Global Values:", {
      freshchatConversationId,
      freshchat_user_id,
      isWithinTimeRange,
    });

    if (!freshchatConversationId) {
      return res
        .status(404)
        .send({ error: "freshchat_conversation_id not found in response" });
    }

    // Send the variables back to the client
    res.status(200).send({ freshchatConversationId, isWithinTimeRange });
  } catch (error) {
    console.error("Error fetching conversation ID:", error.message);
    res.status(500).send({
      error: "Failed to fetch conversation ID",
      details: error.response?.data || error.message,
    });
  }
});








app.post("/api/submit-information", async (req, res) => {
  const {name,
    FirstName,
    LastName,
    email,
    Phone,
    freshchat_conversation_id_for_db,
    feedback_append,emailPromotion
  } = req.body;

  // Validate input
  if (!name || !email || !freshchat_conversation_id_for_db || !Phone) {
    return res.status(400).send({
      error: "Full name, email,phone and freshchat conversation ID are required.",
    });
  }

  console.log(req.body);

  // Get the current time
  const currentTime = new Date().toISOString(); // Generate ISO 8601 formatted timestamp

  try {
    // Insert data into the `voiceflow_data` table
    const query =
      "INSERT INTO voiceflow_data (time, fullname, email,phone, freshchat_conversation_id,email_promotion) VALUES ($1, $2, $3, $4,$5,$6)";
    const values = [currentTime, name, email,Phone, freshchat_conversation_id_for_db,emailPromotion];
    
    await pool.query(query, values);

    

    res.status(200).send({
      message: "Data successfully saved to the database.",
    });
  } catch (error) {
    console.error("Error saving data to the database:", error.message);

    res.status(500).send({
      error: "Failed to save data to the database",
      details: error.message,
    });
  }
});


// Close the pool on server shutdown
process.on("SIGINT", () => {
  pool.end(() => {
    console.log("PostgreSQL pool has ended.");
    process.exit(0);
  });
});






app.get("/chatbot", (req, res) => {
  const htmlFilePath = path.join(__dirname, "portmacqnbnupgrade_com__.html"); // Construct absolute path
  res.type("html"); // Set the MIME type explicitly to text/html
  res.sendFile(htmlFilePath, (err) => {
    if (err) {
      console.error("Error serving HTML file:", err);
      res.status(500).send("Failed to load the chatbot page.");
    }
  });
});




app.get("/", (req, res) => {
  res.send("Welcome to the proxy server. Use the /proxy route to fetch data.");
});




app.post("/api/proxy", async (req, res) => {
  const {conversationId} = req.body; // Pass the conversation ID as a query parameter
  
  //const token = req.query.token; // Pass the token as a query parameter
  
  if (!conversationId) {
    return res.status(400).send("Missing conversation_id or token");
  }
  
  const apiUrl = `https://internet-807115875383812901-b33739ced734ba517388168.freshchat.com/v2/conversations/${conversationId}/messages`;

  try {
    // Make a request to the Freshchat API using Axios
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Send the API response back to the client
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Error while fetching data:", error.message);
    //res.status(error.response?.status || 500).send(error.response?.data || "An error occurred");
  }
});

// Start the server
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});