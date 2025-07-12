FROM mysql:8.0

# Copy custom MySQL configuration if needed
# COPY my.cnf /etc/mysql/conf.d/

# MySQL health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD mysqladmin ping -h localhost -u root -p${MYSQL_ROOT_PASSWORD}