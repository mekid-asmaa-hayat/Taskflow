CREATE TABLE users (
    id            VARCHAR(36)  PRIMARY KEY,
    email         VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name    VARCHAR(50)  NOT NULL,
    last_name     VARCHAR(50)  NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'MEMBER',
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE projects (
    id          VARCHAR(36)  PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    status      VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    owner_id    VARCHAR(36)  NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    due_date    TIMESTAMP,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE project_members (
    project_id VARCHAR(36) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id    VARCHAR(36) NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
    PRIMARY KEY (project_id, user_id)
);

CREATE TABLE tasks (
    id             VARCHAR(36)  PRIMARY KEY,
    title          VARCHAR(200) NOT NULL,
    description    TEXT,
    status         VARCHAR(20)  NOT NULL DEFAULT 'TODO',
    priority       VARCHAR(20)  NOT NULL DEFAULT 'MEDIUM',
    position       INTEGER      NOT NULL DEFAULT 0,
    due_date       TIMESTAMP,
    project_id     VARCHAR(36)  NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    assignee_id    VARCHAR(36)           REFERENCES users(id)    ON DELETE SET NULL,
    created_by_id  VARCHAR(36)  NOT NULL REFERENCES users(id)    ON DELETE RESTRICT,
    parent_task_id VARCHAR(36)           REFERENCES tasks(id)    ON DELETE CASCADE,
    created_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_task_project  ON tasks(project_id);
CREATE INDEX idx_task_assignee ON tasks(assignee_id);
CREATE INDEX idx_task_status   ON tasks(status);

CREATE TABLE comments (
    id         VARCHAR(36) PRIMARY KEY,
    content    TEXT        NOT NULL,
    task_id    VARCHAR(36) NOT NULL REFERENCES tasks(id)    ON DELETE CASCADE,
    author_id  VARCHAR(36) NOT NULL REFERENCES users(id)    ON DELETE RESTRICT,
    created_at TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP   NOT NULL DEFAULT NOW()
);
