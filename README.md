# Django Mail Application

## Overview

A simple mail app that authenticates users, allows users to send, receive and archive emails. Built entirely with Django.

## Features

- **Send Emails**: Users can compose and send emails with support for plain text and HTML content.
- **Receive Emails**: The application checks and displays emails from a user-specified email account.
- **Email Management**: Users can organize their emails, mark them as read/unread, and search through their inbox.
- **Responsive Design**: The web interface is fully responsive and works on various devices and screen sizes.

## Getting Started

### Prerequisites

- Python (3.8 or newer)
- Django (4.0 or newer)

### Installation

Follow these steps to get your development environment set up:

1. **Clone the repository**:
`git clone https://github.com/yourusername/django-mail-app.git`

3. **Install required dependencies**:
`pip install -r requirements.txt`

4. **Apply the migrations**:
`python manage.py migrate`

5. **Run the development server**:
`python manage.py runserver`

7. **Access the web application** at `http://localhost:8000`.

## Usage

- **Login**: Use your email credentials to log in to the mail application.
- **Sending Emails**: Navigate to the "Compose" section, fill in the recipient's email, subject, and message, then click "Send".
- **Inbox**: View received emails in the "Inbox" tab. Click on an email to read its contents.
