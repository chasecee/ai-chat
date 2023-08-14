import { createClient } from "@supabase/supabase-js";
import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

interface EntryCompletion {
  id: number;
  prompt: string;
  completion?: string;
  timestamp: Date;
}
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error("Supabase credentials are not defined");
}

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);

// Create an OpenAI API client (that's edge friendly!)
const openAIConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openAIConfig);

export const runtime = "edge";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  // Log the entry
  const insertResponse = await supabase
    .from("entries_completions")
    .insert([{ prompt }]);

  if (insertResponse.error) {
    // Handle the error
    console.error("Error inserting prompt:", insertResponse.error);
    return new Response("Error inserting prompt", { status: 500 });
  }

  // Query the table to retrieve all inserted data based on the prompt
  const queryResponse = await supabase
    .from("entries_completions")
    .select("id")
    .eq("prompt", prompt);

  if (queryResponse.error || !queryResponse.data) {
    // Handle the error
    console.error("Error retrieving inserted data:", queryResponse.error);
    return new Response("Error retrieving inserted data", { status: 500 });
  }

  // Handle the retrieved data (e.g., use the first matching row)
  const entryId = queryResponse.data[0].id;

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    stream: true,
    temperature: 0.9,
    max_tokens: 100,
    prompt: `Create three slogans for a business with unique features.
 
Business: Bookstore with cats
Slogans: "Purr-fect Pages", "Books and Whiskers", "Novels and Nuzzles"
Business: Gym with rock climbing
Slogans: "Peak Performance", "Reach New Heights", "Climb Your Way Fit"
Business: ${prompt}
Slogans:`,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Update the record with the completion
  await supabase
    .from("entries_completions")
    .update([{ completion: JSON.stringify(response) }])
    .eq("id", entryId);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
