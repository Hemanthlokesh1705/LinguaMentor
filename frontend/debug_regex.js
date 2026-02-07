const text = `[Conversation]
Bengaluru! Yes, it's the correct name for the city. You'll find a lot of IT companies and startups there. What are you looking forward to experiencing in Bengaluru?

[/Conversation]

[Correction]
{
    "original": "going",
    "improved": "going to",
    "explanation": "In English, we use 'going to' when talking about future plans or intentions."
}
[/Correction]`;

const parseResponse = (text) => {
    let content = text;
    let correction = undefined;

    console.log("Original text length:", text.length);

    // 1. Extract Correction block
    const correctionMatch = text.match(/\[Correction\]([\s\S]*?)\[\/Correction\]/i);
    
    if (correctionMatch) {
        console.log("Correction Match Found!");
        try {
            let jsonStr = correctionMatch[1].trim();
            // Remove potential markdown
            jsonStr = jsonStr.replace(/^\`\`\`json\s*/i, "").replace(/^\`\`\`\s*/i, "").replace(/\`\`\`$/, "").trim();
            
            console.log("JSON String to parse:", jsonStr);
            correction = JSON.parse(jsonStr);
            console.log("Parsed Correction:", correction);
            
            // Remove the ENTIRE correction block from the content
            content = content.replace(correctionMatch[0], "");
        } catch (e) {
            console.error("Failed to parse correction JSON:", e);
        }
    } else {
        console.log("No Correction Match Found");
    }

    // 2. Remove Conversation tags
    content = content.replace(/\[\/?Conversation\]/gi, "").trim();
    
    console.log("Final Content:", content);
    return { content, correction };
};

parseResponse(text);
