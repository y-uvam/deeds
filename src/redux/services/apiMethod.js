export const Method = {
  GET(builder, url, header) {
    return builder.query({
      query: (body) => ({
        url: url,
        method: "GET",
        body: body,
        headers: header,
      }),
    });
  },
  POST(builder, url, header) {
    return builder.mutation({
      query: (body) => ({
        url: url,
        method: "POST",
        body: body,
        headers: header,
        formData: true,
      }),
    });
  },
  PUT(builder, url, header) {
    return builder.mutation({
      query: (body) => ({
        url: url,
        method: "PUT",
        body: body,
        headers: header,
        formData: true,
      }),
    });
  },
  DELETE(builder, url, header) {
    return builder.mutation({
      query: (body) => ({
        url: url,
        method: "DELETE",
        body: body,
        headers: header,
      }),
    });
  },
  PATCH(builder, url, header) {
    return builder.mutation({
      query: (body) => ({
        url: url,
        method: "PATCH",
        body: body,
        headers: header,
      }),
    });
  },
  GETPARAMS(builder, url, header) {
    return builder.query({
      query: (id) => ({
        url: `${url}/${id}`,
        method: "GET",
        headers: header,
      }),
    });
  },
};
