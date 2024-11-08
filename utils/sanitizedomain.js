const sanitizeSubdomain= (name) => {
  return name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
};

module.exports = {sanitizeSubdomain}