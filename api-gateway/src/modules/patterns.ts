export const patterns = {
  USER: {
    CREATE: { cmd: 'create_user' },
    FIND_ALL: { cmd: 'find_all_users' },
    FIND_BY_ID: { cmd: 'find_user_by_id' },
    UPDATE: { cmd: 'update_user' },
    DELETE: { cmd: 'delete_user' },
    FIND_BY_EMAIL: { cmd: 'find_user_by_email' },
    RESET_PASSWORD: { cmd: 'reset_password' },
  },
};