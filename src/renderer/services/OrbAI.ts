import OpenAI from 'openai';

export class OrbAI {
    private static instance: OrbAI;
    private openai: any;
    public static getInstance() {
        if (!OrbAI.instance) {
            const orbAI = new OrbAI();
            orbAI.openai = new OpenAI({
                apiKey: "",
                dangerouslyAllowBrowser: true
            });
            OrbAI.instance = orbAI;
        }

        return OrbAI.instance;
    }


    public runPrompt = async (prompt: string) => {
        const response = await this.openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { "role": "user", "content": prompt }
            ]
        });

        const parsedResponse = response.choices[0].message;        
        return parsedResponse;
    };
}
