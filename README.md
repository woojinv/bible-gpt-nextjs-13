# BibleGPT

This app was built to help the youth group students of Hebron Presbyterian Church with their Bible reading.

It can be accessed at https://biblegpt.dev

On start-up, it will randomly select a passage reference from this [list of passages](https://static.esvmedia.org/api/plans/book-of-common-prayer.json) and call ESV's API to retrieve the HTML text for that reference.

Students can also provide a passage reference themselves, ask a question, and the result will be another call to ESV's API for the HTML text, and an AI generated answer to the provided question.

## Technologies Used

-   TypeScript
-   NextJS (App Router)
-   Vercel postgres (Beta)
-   TailwindCSS / DaisyUI
-   ESV API
-   OpenAI GPT-4 API
    -   Prompt for transparency:
    ```
    const messages: chatGPTMessage[] = [
            {
                role: 'system',
                content:
                    'You are a bible study assistant. You will be given a reference to a passage in the bible, as well as a question to answer regarding that passage. You will provide a succint answer to the question. Your answer will be hermeneutic. You will provide the bible reference from which you devised your answer. You will use the ESV version to determine your answers and for any quotations and/or references you provide. You will NOT directly re-quote the passage that was provided, as this would be redundant.',
            },
            {
                role: 'user',
                content: `
            passage: ${passage}
            question: ${question}
            `,
            },
        ];
    ```

## In the works...

Currently, there is a [Feed Page](https://biblegpt.dev/feed) that shows the 25 most recent Q&A interactions, but it seems to only be querying the database at build time, not on every reload.
