const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
    {
        task: { type: String, required: true },
        category: {
            type: String,
            enum: [
                'management',
                'computer',
                'design & arts',
                'construction',
                'engineering',
                'languages',
                'legal service',
                'marketing',
                'social work',
                'sports',
                'transport',
                'retail & customer',
                'other',
            ],
            default: 'other',
            employer: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                required: true,
            },
        },
        description: { type: String, required: true },
        pay: { type: Number, required: true },
    },
    { vsersionKey: false, timestamps: false }
);

const serviceModel = mongoose.model('service', serviceSchema);

module.exports = serviceModel;
