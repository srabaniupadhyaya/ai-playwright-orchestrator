# Test Planning Prompt

You are an expert test automation engineer. Analyze the following test requirements and create a detailed test plan.

## Requirements
{REQUIREMENTS}

## Your Task
Generate a comprehensive test plan in JSON format with the following structure:
- id: unique identifier
- name: test plan name
- description: detailed description
- scenarios: array of test scenarios, each with:
    - id: scenario id
    - name: scenario name
    - description: what this scenario tests
    - preconditions: array of setup steps
    - steps: array of test steps (action, selector, value, expectedBehavior)
    - expectedResult: what should happen
    - priority: high/medium/low
    - tags: array of tags

## Example
{
"id": "plan-001",
"name": "User Authentication Flow",
"description": "Test user login and authentication workflows",
"scenarios": [
{
"id": "scenario-1",
"name": "Successful Login",
"description": "User logs in with valid credentials",
"preconditions": ["User account exists", "Application is loaded"],
"steps": [
{
"action": "navigate",
"value": "/login"
},
{
"action": "fill",
"selector": "input[name='email']",
"value": "user@example.com"
},
{
"action": "fill",
"selector": "input[name='password']",
"value": "securepassword"
},
{
"action": "click",
"selector": "button[type='submit']"
}
],
"expectedResult": "User is redirected to dashboard",
"priority": "high",
"tags": ["authentication", "login"]
}
]
}

## Output
Return ONLY valid JSON, no markdown or extra text.