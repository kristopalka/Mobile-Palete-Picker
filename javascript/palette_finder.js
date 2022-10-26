function get_pixel_dataset(img, resized_pixels) {



    if (resized_pixels === undefined) resized_pixels = -1;
    // Get pixel colors from a <canvas> with the image
    const canvas = document.createElement("canvas");
    const img_n_pixels = img.width * img.height;
    let canvas_width = img.width;
    let canvas_height = img.height;
    if (resized_pixels > 0 && img_n_pixels > resized_pixels) {
        const rescaled = rescale_dimensions(img.width, img.height, resized_pixels);
        canvas_width = rescaled[0];
        canvas_height = rescaled[1];
    }
    canvas.width = canvas_width;
    canvas.height = canvas_height;
    const canvas_n_pixels = canvas_width * canvas_height;
    const context = canvas.getContext("2d");
    context.drawImage(img, 0, 0, canvas_width, canvas_height);
    const flattened_dataset = context.getImageData(
        0, 0, canvas_width, canvas_height).data;
    const n_channels = flattened_dataset.length / canvas_n_pixels;
    const dataset = [];
    for (let i = 0; i < flattened_dataset.length; i += n_channels) {
        dataset.push(flattened_dataset.slice(i, i + n_channels));
    }
    return dataset;
}

function k_means(dataset, k) {
    let i;
    let idx;
    if (k === undefined) k = Math.min(3, dataset.length);
    // Use a seeded random number generator instead of Math.random(),
    // so that k-means always produces the same centroids for the same
    // input.
    let rng_seed = 0;
    const random = function () {
        rng_seed = (rng_seed * 9301 + 49297) % 233280;
        return rng_seed / 233280;
    };
    // Choose initial centroids randomly.
    let centroids = [];
    for (i = 0; i < k; ++i) {
        idx = Math.floor(random() * dataset.length);
        centroids.push(dataset[idx]);
    }
    while (true) {
        // 'clusters' is an array of arrays. each sub-array corresponds to
        // a cluster, and has the points in that cluster.
        const clusters = [];
        for (i = 0; i < k; ++i) {
            clusters.push([]);
        }
        for (i = 0; i < dataset.length; ++i) {
            const point = dataset[i];
            const nearest_centroid = nearest_neighbor(point, centroids);
            clusters[nearest_centroid].push(point);
        }
        let converged = true;
        for (i = 0; i < k; ++i) {
            const cluster = clusters[i];
            let centroid_i = [];
            if (cluster.length > 0) {
                centroid_i = centroid(cluster);
            } else {
                // For an empty cluster, set a random point as the centroid.
                idx = Math.floor(random() * dataset.length);
                centroid_i = dataset[idx];
            }
            converged = converged && arrays_equal(centroid_i, centroids[i]);
            centroids[i] = centroid_i;
        }
        if (converged) break;
    }
    return centroids;
}

function centroid(dataset) {
    let i;
    if (dataset.length === 0) return [];
    const running_centroid = [];
    for (i = 0; i < dataset[0].length; ++i) {
        running_centroid.push(0);
    }
    for (i = 0; i < dataset.length; ++i) {
        const point = dataset[i];
        for (let j = 0; j < point.length; ++j) {
            running_centroid[j] += (point[j] - running_centroid[j]) / (i+1);
        }
    }
    return running_centroid;
}

function nearest_neighbor(point, neighbors) {
    let best_dist = Infinity; // squared distance
    let best_index = -1;
    for (let i = 0; i < neighbors.length; ++i) {
        const neighbor = neighbors[i];
        let dist = 0;
        for (let j = 0; j < point.length; ++j) {
            dist += Math.pow(point[j] - neighbor[j], 2);
        }
        if (dist < best_dist) {
            best_dist = dist;
            best_index = i;
        }
    }
    return best_index;
}

function arrays_equal(a1, a2) {
    if (a1.length !== a2.length) return false;
    for (let i = 0; i < a1.length; ++i) {
        if (a1[i] !== a2[i]) return false;
    }
    return true;
}

function rescale_dimensions(w, h, pixels) {
    const aspect_ratio = w / h;
    const scaling_factor = Math.sqrt(pixels / aspect_ratio);
    const rescaled_w = Math.floor(aspect_ratio * scaling_factor);
    const rescaled_h = Math.floor(scaling_factor);
    return [rescaled_w, rescaled_h];
}