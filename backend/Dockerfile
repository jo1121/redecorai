FROM node:18-alpine

# Install git for any git-based dependencies
RUN apk add --no-cache git

# Create app directory
WORKDIR /workspaces/redecorai

# Create a non-root user for vscode
RUN addgroup -g 1000 vscode && \
    adduser -D -s /bin/sh -u 1000 -G vscode vscode

# Switch to vscode user
USER vscode

# Expose the port that your backend uses
EXPOSE 5000

# Keep container running
CMD ["tail", "-f", "/dev/null"]