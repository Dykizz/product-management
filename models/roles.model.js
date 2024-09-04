const moongose = require('mongoose')

const rolesSchema = new moongose.Schema({
    title: String,
    description: String,
    permissions: {
        type: Array,
        default: []
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deleteAt: Date
}, {
    timestamps: true
});

const Roles = moongose.model('Roles', rolesSchema, 'roles');

module.exports = Roles;