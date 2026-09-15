function getHealth(request, response) {
  response.json({
    status: 'ok',
    service: 'projectxplain-backend',
  });
}

module.exports = { getHealth };