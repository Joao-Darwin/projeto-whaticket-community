import fs from "fs";
import {OpenAI} from "openai";
import { Transcription } from "openai/resources/audio/transcriptions";
import path from "path";

type Response = Transcription | string;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const TranscribeAudioMessageToText = async (fileName: string): Promise<Response> => {
    
    const filePath = path.join(__dirname + "../" + "../" + "../../" + "public/" + fileName);

    try {
        
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: "whisper-1",
            language: "pt",
            response_format: "text"
        })

        return transcription;

    } catch (error) {
        console.log(error);
        return "Conversão pra texto falhou";
    }
}

export default TranscribeAudioMessageToText;