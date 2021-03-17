const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc  get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
const getBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find();
    res.status(200).send({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })

    res.status(400).send({
        success: false
    })
})

// @desc  get single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
const getBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    res.status(200).send({
        success: true,
        data: bootcamp
    })
});

// @desc  create a bootcamp
// @route POST /api/v1/bootcamps/
// @access Public
const createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).send({
        success: true,
        data: bootcamp
    })
})

// @desc  update a bootcamp 
// @route PUT /api/v1/bootcamps/:id
// @access Public
const updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    res.status(200).send({
        success: true,
        data: bootcamp
    })
})

// @desc  delete a bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Public
const deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    res.status(200).send({
        success: true,
        data: {}
    })
});

module.exports = {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp
}