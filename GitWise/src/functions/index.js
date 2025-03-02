
module.exports = async function (context, req) {
    const githubEvent = req.headers['x-github-event']; // Get the event type (pull_request, push, etc.)
    const prData = req.body; // Get the actual payload, which contains the PR data

    // Log the event and payload to help with debugging
    context.log('Received GitHub event: ' + githubEvent);
    context.log('PR Data:', prData);

    // Process different event types (e.g., pull_request, push)
    switch (githubEvent) {
        case 'pull_request':
            const action = prData.action; // Action on PR: opened, closed, reopened, etc.
            const prTitle = prData.pull_request.title;
            const prUrl = prData.pull_request.html_url;
            const prUser = prData.pull_request.user.login;

            context.log(`PR Action: ${action}`);
            context.log(`PR Title: ${prTitle}`);
            context.log(`PR URL: ${prUrl}`);
            context.log(`PR Author: ${prUser}`);

            // Process the data based on action
            if (action === 'opened') {
                await postCommentToPR(prUrl, "Thank you for your PR! We'll review it shortly.");
            }

            break;

        case 'push':
            // Process push events (if needed)
            break;

        default:
            context.log('Unsupported event: ' + githubEvent);
            break;
    }

    // Respond to GitHub that the webhook was successfully received
    context.res = {
        status: 200,
        body: "Webhook received successfully"
    };
};

// Example function to post a comment to the PR
async function postCommentToPR(prUrl, comment) {
    const githubToken = process.env.GITHUB_TOKEN; // Store GitHub token as an environment variable

    const prApiUrl = prUrl + "/comments"; // GitHub API URL to post comments

    const response = await fetch(prApiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `token ${githubToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            body: comment // The content of the comment
        })
    });

    if (response.ok) {
        console.log('Comment posted successfully');
    } else {
        console.error('Failed to post comment:', response.statusText);
    }
}
