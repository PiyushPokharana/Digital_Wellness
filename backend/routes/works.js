const express = require('express');
const Work = require('../models/Work');

const router = express.Router();

/**
 * GET /api/works
 * Get all student works with optional filtering and sorting
 * Query params:
 * - category: Filter by category
 * - search: Search by name or title
 * - sort: Sort by 'newest' (default) or 'oldest'
 */
router.get('/', async (req, res) => {
  try {
    const { category, search, sort = 'newest' } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const requestedLimit = parseInt(req.query.limit, 10) || 20;
    const limit = Math.min(Math.max(requestedLimit, 1), 100);

    // Build query
    let query = {};

    // Filter by category if provided
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search by name or title if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } }
      ];
    }

    // Determine sort order
    const sortOrder = sort === 'oldest' ? 1 : -1;

    const [works, totalCount] = await Promise.all([
      Work.find(query)
        .sort({ timestamp: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-__v'),
      Work.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / limit) || 1;

    res.json({
      success: true,
      count: works.length,
      totalCount,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      works
    });

  } catch (error) {
    console.error('Error fetching works:', error);
    res.status(500).json({
      error: 'Failed to fetch works',
      message: error.message
    });
  }
});

/**
 * GET /api/works/:id
 * Get single work by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const work = await Work.findById(req.params.id).select('-__v');

    if (!work) {
      return res.status(404).json({
        error: 'Work not found'
      });
    }

    res.json({
      success: true,
      work: work
    });

  } catch (error) {
    console.error('Error fetching work:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid work ID'
      });
    }

    res.status(500).json({
      error: 'Failed to fetch work',
      message: error.message
    });
  }
});

/**
 * DELETE /api/works/:id
 * Delete a work (admin only - add authentication later)
 */
router.delete('/:id', async (req, res) => {
  try {
    const work = await Work.findByIdAndDelete(req.params.id);

    if (!work) {
      return res.status(404).json({
        error: 'Work not found'
      });
    }

    // TODO: Also delete from Cloudinary if needed
    // For now, just delete from database

    res.json({
      success: true,
      message: 'Work deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting work:', error);
    res.status(500).json({
      error: 'Failed to delete work',
      message: error.message
    });
  }
});

module.exports = router;
