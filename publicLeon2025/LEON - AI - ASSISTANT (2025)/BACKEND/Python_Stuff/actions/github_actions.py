# actions/github_actions.py
import os
import requests

def create_github_repo(repo_name, token):
    url = "https://api.github.com/user/repos"
    headers = {
        # PLACE YOUR GITHUB TOKEN INSIDE THE .env
        "Authorization": f"token {token}", 
        "Accept": "application/vnd.github.v3+json"
    }
    data = {
        "name": repo_name,
        "private": False  # Set to True if you want private repo
    }

    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 201:
        return f"Repository '{repo_name}' created successfully on GitHub."
    else:
        return f"Failed to create repository: {response.json().get('message', 'Unknown error')}"
