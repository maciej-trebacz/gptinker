import { Message } from "@/types";

class APICaller {
  private baseURL: string;

  constructor(baseURL = "/api") {
    this.baseURL = baseURL;
  }

  private async fetchWrapper(
    endpoint: string,
    method: string,
    body: unknown
  ): Promise<Response> {
    const response = await fetch(this.baseURL + endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response;
  }

  public async ask(
    description: string,
    text: string,
    callbacks: {
      onMessage: (message: unknown) => void,
      onClose: () => void,
      onError: (error: Error) => void
    },
    messages: Message[]
  ): Promise<void> {
    const body = {
      description,
      text,
      messages,
    };

    const response = await this.fetchWrapper("/ask", "POST", body);
    if (response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let data = "";

      const processChunk = async (chunk: Uint8Array) => {
        data += decoder.decode(chunk, { stream: true });

        let separatorIndex;
        while ((separatorIndex = data.indexOf("\n\n")) !== -1) {
          const message = data.slice(0, separatorIndex);
          data = data.slice(separatorIndex + 2);

          if (message.startsWith("event: close")) {
            callbacks.onClose();
            return;
          } else if (message.startsWith("data: ")) {
            const eventData = JSON.parse(message.slice("data: ".length));
            callbacks.onMessage(eventData);
          }
        }
      };

      reader.read().then(async function processStream(result) {
        if (result.done) {
          return;
        }

        await processChunk(result.value);
        reader.read().then(processStream, callbacks.onError);
      });
    }
  }
}

export default APICaller;