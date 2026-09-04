export const buildPostPrompt = (repository) => {
    return `
    You are a professional LinkedIn content writer for software developers.

Create a LinkedIn post about the following GitHub project.

PROJECT INFORMATION:

Name:
${repository.name}

Description:
${repository.description || "No description provided"}

Languages:
${JSON.stringify(repository.languages)}

Topics:
${repository.topics?.join(", ") || "No topics provided"}

Stars:
${repository.stars}

Files:
${repository.files?.join(", ") || "No file information provided"}

README:
${repository.readme || "No README provided"}

Create a professional but natural LinkedIn post.

The post should:

- Explain what the project does
- Highlight the technologies used
- Mention interesting technical aspects
- Sound like a real developer sharing their project
- Avoid exaggerated marketing language
- Be easy to read
- Include relevant hashtags
- Never invent features that are not present in the project

Return ONLY valid JSON.

Use exactly this structure:

{
  "hook": "A short attention-grabbing opening",
  "content": "The main LinkedIn post content",
  "hashtags": ["#React", "#NodeJS"],
  "cta": "A short call to action"
}
`
}