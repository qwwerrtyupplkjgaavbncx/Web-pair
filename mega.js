const mega = require("megajs");

const auth = {
    email: 'xepovod501@dotxan.com', // MEGA email
    password: 'Chamindu2008', // MEGA password
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
};

const upload = (data, name) => {
    return new Promise((resolve, reject) => {
        try {
            // Create MEGA storage instance
            const storage = new mega.Storage(auth, () => {
                let uploader;

                // Check if it's a buffer or stream
                if (Buffer.isBuffer(data)) {
                    // For Buffer (temp file or memory)
                    uploader = storage.upload({ name, allowUploadBuffering: true });
                    uploader.end(data);
                } else {
                    // For Stream
                    uploader = storage.upload({ name, allowUploadBuffering: true });
                    data.pipe(uploader);
                }

                uploader.on('complete', file => {
                    file.link((err, url) => {
                        storage.close();
                        if (err) return reject(err);
                        resolve(url);
                    });
                });

                uploader.on('error', err => {
                    storage.close();
                    reject(err);
                });
            });

            storage.on('error', err => reject(err));
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = { upload };
