/**
 * Error responses
 */
const errors = {
  404(req: any, res: any): void {
    const viewFilePath = '404';
    const statusCode = 404;
    const result = {
      status: statusCode,
    };

    res.status(result.status);
    res.render(viewFilePath, {}, (err: any, html: any): any => {
      if (err) { return res.status(result.status).json(result); }
      return res.send(html);
    });
  },
};

export { errors };
