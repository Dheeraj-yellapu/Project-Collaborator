
# Project-Collaborator

## Description
Students and enthusiasts often struggle to find collaborators for projects or discover ongoing 
initiatives within their community. This gap stifles innovation, limits skill-sharing, and delays 
community growth. Without a centralized platform, talent remains underutilized, and projects lack 
diverse expertise. 

To tackle this problem, I am introducing a web-based platform to unite individuals with 
shared interests, enabling systematic collaboration on projects. It acts as a hub for finding 
collaborators (experts or peers), discovering ongoing projects and managing workflows in a 
structured project rooms.
## Features

### Authentication

- **Sign In & Sign Up**: Secure user authentication for seamless access and registration.

### Dashboard

- **Homepage**: Interactive visual dashboard showcasing active project "rooms" for quick access and overview.

### Project Proposals

- **Proposal System**: Pitch and submit new project ideas to spark collaboration.

### Notifications

- **Alerts**: Real-time notifications for project proposals aligned with user interests.

### Membership Management

- **Apply to Join**: Users can apply to become members of project rooms.
- **Add Members**: Admins can invite and add users to project channels.

### Logout

- **Logout Option**: Simple and secure user logout functionality.

### Real-Time Collaboration

- **Chat System**: Real-time chat powered by Stream API, featuring:
  - Document sharing
  - Message threading
  - Emoji support

### Project Management

- **Centralized Project Details**: Comprehensive hub for:
  - Project goals
  - Timelines
  - Team roles
- **Task Management Tools**: Streamlined workflow tools for task assignment and tracking (*in development*).

### User Customization

- **Profile Editor**: Personalize user profiles with custom details (*in development*).
## Demo



## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## Running Tests

To run tests, run the following command

```bash
  npm run test
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`API_KEY`

`ANOTHER_API_KEY`


## API Reference

#### Get all items

```http
  GET /api/items
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get item

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### add(num1, num2)

Takes two numbers and returns the sum.

