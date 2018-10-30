// @flow
import urlLoader from "url-loader";
import * as Abstract from "abstract-sdk";

const abstract = Abstract.Client({
  transport: Abstract.TRANSPORTS.API
});

export default function abstractLinkLoader(content: string): void {
  const callback = this.async();

  let result;
  (async () => {
    const descriptor = JSON.parse(content);

    let abstractContent;
    try {
      if (descriptor.layerId) {
        abstractContent = await abstract.previews.raw(descriptor);
      }
    } catch (error) {
      callback(error);
      return;
    }

    if (abstractContent === undefined) {
      callback(new Error(`Could not load link for ${descriptor}`));
      return;
    }

    result = urlLoader.call(
      {
        ...this,
        // Remove .link from end of resourcePath
        resourcePath: this.resourcePath.split(".link", 1)[0]
      },
      new Buffer(abstractContent)
    );

    callback(null, result);
  })();
}