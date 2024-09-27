# How to Run

1. **Create and connect to a local MySQL database.**

2. **Create a `.env` file with the following contents:**

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD="{your password}"
DB_NAME="{your db name}"
OPENAI_API_KEY="{your openai api key}"
```

Make sure "gpt-4o-mini" and "text-embedding-3-small" is in the allowed models list in your [openAI project settings](https://platform.openai.com/settings/):
![alt text](/public/allowedModel.png)

3. **Start the backend:**

```bash
npm start
```

4. **Start the frontend:**

```bash
npm start
```

# Next Steps

- Create unit tests
- Create a login system with Auth0
