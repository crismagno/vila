
exports.up = function(knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('email').notNull()
        table.string('password').notNull()
        table.string('avatar')
        table.boolean('admin').notNull().default(false)
        table.timestamp('created_at', { useTz: true })
        table.timestamp('updated_at', { useTz: true })
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('users')
};
