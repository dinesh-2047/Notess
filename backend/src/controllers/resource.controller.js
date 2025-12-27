import { Resource } from '../models/Resource.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { deleteFromCloudinary, uploadOnCloudinary } from '../utils/cloudinary.js';

const parseTags = (tags) =>
  Array.from(new Set((tags || '').split(',').map((tag) => tag.trim()).filter(Boolean)));

export const listResources = asyncHandler(async (req, res) => {
  try {
    console.log('listResources called');
    const { course, branch, type, search, status } = req.query;
    console.log('Query params:', req.query);
    
    const filter = {};

    if (course) filter.course = course;
    if (branch) filter.branch = branch;
    if (type) filter.type = type;
    if (status && status !== 'all') filter.status = status;
    if (!status) filter.status = 'published';
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    console.log('Filter constructed:', filter);

    const items = await Resource.find(filter).sort({ createdAt: -1 });
    console.log(`Found ${items.length} resources`);

    res.json(
      new ApiResponse(200, {
        items,
      }),
    );
  } catch (error) {
    console.error('Error in listResources:', error);
    // Send detailed error to client for debugging
    res.status(500).json({
      success: false,
      message: 'Internal Server Error in listResources',
      error: error.message,
      stack: error.stack
    });
  }
});

export const getResource = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const resource = await Resource.findOne({ slug });
  console.log(resource);
  if (!resource) {
    throw new ApiError(404, 'Resource not found');
  }
  res.json(new ApiResponse(200, { resource }));
});

const handleFileUploads = async (files) => {
  const uploads = {};
  if (files?.file?.[0]) {
    // Store primary resource files (pdf, docs) as raw to avoid Cloudinary image handling issues
    uploads.file = await uploadOnCloudinary(files.file[0].path, {
      resourceType: 'raw',
      folder: 'notess/resources',
    });
  }
  if (files?.preview?.[0]) {
    uploads.preview = await uploadOnCloudinary(files.preview[0].path, {
      resourceType: 'image',
      folder: 'notess/resources',
    });
  }
  return uploads;
};

export const createResource = asyncHandler(async (req, res) => {
  let uploads = {};
  try {
    const { title, description, course, branch, semester, type, tags, status } = req.body;

    if (!req.files?.file?.[0]) {
      throw new ApiError(400, 'Primary file is required');
    }

    uploads = await handleFileUploads(req.files);
    const tagList = parseTags(tags);

    const resource = await Resource.create({
      title,
      description,
      course,
      branch,
      semester,
      type,
      isPaid: false,
      price: 0,
      tags: tagList,
      status: status || 'published',
      fileUrl: uploads.file.secureUrl,
      filePublicId: uploads.file.publicId,
      fileResourceType: uploads.file.resourceType,
      previewUrl: uploads.preview?.secureUrl,
      previewPublicId: uploads.preview?.publicId,
      previewResourceType: uploads.preview?.resourceType,
      createdBy: req.user._id,
      metadata: {
        pages: uploads.file.pages,
        format: uploads.file.format,
        sizeInKb: Math.round((uploads.file.bytes || 0) / 1024),
      },
    });

    res.status(201).json(new ApiResponse(201, { resource }, 'Resource created successfully'));
  } catch (error) {
    // Clean up Cloudinary uploads if DB creation fails
    if (uploads.file?.publicId) {
      await deleteFromCloudinary(uploads.file.publicId, uploads.file.resourceType);
    }
    if (uploads.preview?.publicId) {
      await deleteFromCloudinary(uploads.preview.publicId, uploads.preview.resourceType);
    }
    throw error;
  }
});

export const updateResource = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const resource = await Resource.findById(id);

  if (!resource) {
    throw new ApiError(404, 'Resource not found');
  }

  if (updates.tags) {
    resource.tags = parseTags(updates.tags);
  }
  ['title', 'description', 'course', 'branch', 'semester', 'type', 'status'].forEach((field) => {
    if (updates[field] !== undefined) {
      resource[field] = updates[field];
    }
  });

  const uploads = await handleFileUploads(req.files);
  if (uploads.file) {
    await deleteFromCloudinary(resource.filePublicId, resource.fileResourceType || 'raw');
    resource.fileUrl = uploads.file.secureUrl;
    resource.filePublicId = uploads.file.publicId;
    resource.fileResourceType = uploads.file.resourceType;
    resource.metadata = {
      pages: uploads.file.pages,
      format: uploads.file.format,
      sizeInKb: Math.round((uploads.file.bytes || 0) / 1024),
    };
  }

  if (uploads.preview) {
    if (resource.previewPublicId) {
      await deleteFromCloudinary(resource.previewPublicId, resource.previewResourceType || 'image');
    }
    resource.previewUrl = uploads.preview.secureUrl;
    resource.previewPublicId = uploads.preview.publicId;
    resource.previewResourceType = uploads.preview.resourceType;
  }

  // Ensure all resources remain free
  resource.isPaid = false;
  resource.price = 0;

  await resource.save();
  res.json(new ApiResponse(200, { resource }, 'Resource updated successfully'));
});

export const deleteResource = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const resource = await Resource.findById(id);
  if (!resource) {
    throw new ApiError(404, 'Resource not found');
  }

  await deleteFromCloudinary(resource.filePublicId, resource.fileResourceType || 'raw');
  if (resource.previewPublicId) {
    await deleteFromCloudinary(resource.previewPublicId, resource.previewResourceType || 'image');
  }

  await resource.deleteOne();
  res.json(new ApiResponse(200, {}, 'Resource deleted'));
});

export const downloadResource = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const resource = await Resource.findById(id);
  if (!resource) {
    throw new ApiError(404, 'Resource not found');
  }

  resource.downloadCount += 1;
  await resource.save({ validateBeforeSave: false });

  // Generate a Cloudinary attachment URL so browsers download instead of previewing
  const buildDownloadUrl = (url) => {
    if (!url) return url;
    if (url.includes('res.cloudinary.com')) {
      return url.replace('/upload/', '/upload/fl_attachment/');
    }
    return url;
  };

  const downloadUrl = buildDownloadUrl(resource.fileUrl);

  res.json(new ApiResponse(200, { url: downloadUrl }, 'Download link ready'));
});
