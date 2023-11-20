# Introduction 
This is the server for the ResLock mobile app. This connects our frontend to our database and manages all endpoints for manipulating our data

# Getting Started
**Local Installation Process**
1. Open a terminal and run `npm install`
2. Go to `.env.sample` and follow the instructions for setting up your environment variables
3. Ensure you have a schema created in your mysql database and that its name matches what you put in your created `.env` file otherwise step 4 will not work
4. Run `npm run set-up`, this will set up the data tables for the schema you made in SQL
5. Run `npm run db-fill` to fill empty data tables.
6. Run `npm run dev` to start up the server when developing
7. Run `npm start` to start up without auto-refresh (production)

**Project Dependencies**
This project uses mysql2, node-db-migrate, node, and express so far. You'll get an error when migrating up telling you it will eventually throw an error, lets hope that never happens

# Build and Test
So Far N/A

# Contribute
TODO: Explain how other users and developers can contribute to make your code better. 

If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:
- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)