<div align="center">
  <img src="./assets/nexusframework.png" alt="Nexus Framework Logo" width="200"/>
</div>

# Nexus Framework

## Overview

- This is a Command and Control (C2) server implemented in Golang. It provides a centralized server for managing and controlling connected agents.
- It comes with built in payloads and a cli

## Features

- [x] Agent registration and authentication
- [ ] Command execution on registered agents
- [ ] Communication encryption
- [x] Web-based dashboard for monitoring and control
- [ ] Extensible plugin architecture

## Getting Started

### Prerequisites

- Golang installed on the server

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Icarus131/nexus-framework/
cd nexus-framework
go run main.go
```

### Usage

#### Agent Registration

- Agents should be configured to register with the C2 server upon startup. Registration involves sending authentication credentials and a uniquely generated API key on each run.

- Example agent registration payload:

```bash

API Key: f06e7d075dec24df1ad96bde8f3b98cb726ad564c7b28fc329dffbfa7f369222
 -> Welcome to the Nexus-Framework Setup. Use 'r' to register a new user or 'q' to quit.

 ┬─[Nexus-Framework]
 ╰─> r
Register a new user:
Enter username: icarus
Enter password: icarus123
Received API Key: f06e7d075dec24df1ad96bde8f3b98cb726ad564c7b28fc329dffbfa7f369222
User registered successfully!

```

#### Security Considerations

- Uses HTTPS for communication between agents and the C2 server.
