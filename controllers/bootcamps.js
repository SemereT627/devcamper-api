const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const asyncHandler = require('../middleware/async');

// @desc  get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
const getBootcamps = asyncHandler(async (req, res, next) => {
    let query;

    // Copy req.query
    const reqQuery = {
        ...req.query
    };

    // Fields to exclude
    const removeFields = ['select'];

    // Delete from req.query
    removeFields.forEach(inRemove => delete reqQuery[inRemove]);

    console.log(reqQuery);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators  ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = JSON.parse(queryStr);

    // Executing query
    const bootcamps = await Bootcamp.find(query);
    res.status(200).send({
        success: true,
        count: bootcamps.length,
        data: bootcamps
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

// @desc  Get bootcamp within a radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access Private
const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const {
        zipcode,
        distance
    } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calculating radius using radians
    // Divide distance by radius of earth
    // Earth's radius = 3,963 mi/ 6,378 km

    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: {
                $centerSphere: [
                    [lng, lat], radius
                ]
            }
        }
    })

    res.status(200).send({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
});






module.exports = {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius
}