function tenantRequired(req, res, next) {
  const tenantId = req.headers['x-tenant-id'];
  if (!tenantId) return res.status(400).json({ error: 'x-tenant-id header is required' });
  req.tenantId = tenantId;
  next();
}

module.exports = { tenantRequired };
