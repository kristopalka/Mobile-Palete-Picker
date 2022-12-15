// https://github.com/VerboseDaVinci/Hyper-Text-DaVinci/blob/817b1d32da125b18954e6b6630bcba283cfa4a65/convert_image.js

export function getKMeans(dataset, k) {
    if(dataset === undefined) {
        console.log("Error: dataset undefined");
        return null;
    }

    const kMeansOut = kMeans(dataset, k);

    const colors = [];
    for(let i=0; i<kMeansOut.length; i++) {
        const r = Math.round(kMeansOut[i][0]);
        const g = Math.round(kMeansOut[i][1]);
        const b = Math.round(kMeansOut[i][2]);
        colors.push([r, g, b]);
    }
    return colors;
}


function kMeans(dataset, k) {
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
            const nearest_centroid = nearestNeighbor(point, centroids);
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
            converged = converged && arraysEqual(centroid_i, centroids[i]);
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

function nearestNeighbor(point, neighbors) {
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

function arraysEqual(a1, a2) {
    if (a1.length !== a2.length) return false;
    for (let i = 0; i < a1.length; ++i) {
        if (a1[i] !== a2[i]) return false;
    }
    return true;
}

