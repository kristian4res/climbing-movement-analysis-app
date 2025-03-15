import { KEYPOINT_PAIRS } from "@/constants/PoseDetection";
import * as posedetection from '@tensorflow-models/pose-detection';

/**
 * Calculates the centre of mass based on the provided keypoints.
 *
 * @param {posedetection.Keypoint[]} keypoints - An array of keypoints where each keypoint has a name and position.
 * @returns {posedetection.Keypoint | null} A keypoint representing the centre of mass. If any of the keypoints in KEYPOINT_PAIRS are not found, it returns null.
 */
export function calculateCentreOfMass(keypoints: posedetection.Keypoint[]): posedetection.Keypoint | null {
    let totalX = 0, totalY = 0, count = 0;

    for (let pair of KEYPOINT_PAIRS) {
        for (let name of pair) {
            const keypoint = keypoints.find(k => k.name === name);
            if (!keypoint) {
                return null; 
            }
            totalX += keypoint.x;
            totalY += keypoint.y;
            count++;
        }
    }

    return {
        x: totalX / count,
        y: totalY / count,
        score: 1,
        name: 'centre_of_mass'
    };
}

/**
 * Calculates the angles of the legs based on the keypoints provided.
 *
 * @param {posedetection.Keypoint[]} keypoints - An array of keypoints where each keypoint has a name and position.
 * @returns {Object} An object containing the left and right leg angles. If the center of mass, left hip, or right hip keypoints are not found, the corresponding leg angle is null.
 */
export function calculateLeftAndRightAnglesBetweenKeypoints(keypoints: posedetection.Keypoint[], names: string[]): { left: number, right: number } {
    const [name1, name2, name3] = names;

    const point1 = keypoints.find(k => k.name === `left_${name1}`);
    const point2 = keypoints.find(k => k.name === `left_${name2}`);
    const point3 = keypoints.find(k => k.name === `left_${name3}`);

    let leftAngle = 0;
    if (point1 && point2 && point3) {
        leftAngle = calculateAngle(point1, point2, point3);
    }

    const point4 = keypoints.find(k => k.name === `right_${name1}`);
    const point5 = keypoints.find(k => k.name === `right_${name2}`);
    const point6 = keypoints.find(k => k.name === `right_${name3}`);

    let rightAngle = 0;
    if (point4 && point5 && point6) {
        rightAngle = calculateAngle(point4, point5, point6);
    }

    return { left: leftAngle, right: rightAngle };
}   

/**
 * Calculates the angles between the armpits based on the keypoints provided.
 *
 * @param {posedetection.Keypoint[]} keypoints - An array of keypoints where each keypoint has a name and position.
 * @returns {Object} An object containing the left and right armpit angles. If the shoulder, hip, or elbow keypoints are not found, the corresponding armpit angle is null.
 */
export function calculateArmpitAngles(keypoints: posedetection.Keypoint[]): { left: number | null, right: number | null } {
    const leftShoulder = keypoints.find(k => k.name === 'left_shoulder');
    const leftHip = keypoints.find(k => k.name === 'left_hip');
    const leftElbow = keypoints.find(k => k.name === 'left_elbow');

    const leftArmpitAngle = leftShoulder && leftHip && leftElbow ? calculateAngle(leftHip, leftShoulder, leftElbow) : null;

    const rightShoulder = keypoints.find(k => k.name === 'right_shoulder');
    const rightHip = keypoints.find(k => k.name === 'right_hip');
    const rightElbow = keypoints.find(k => k.name === 'right_elbow');

    const rightArmpitAngle = rightShoulder && rightHip && rightElbow ? calculateAngle(rightHip, rightShoulder, rightElbow) : null;

    return {
        left: leftArmpitAngle,
        right: rightArmpitAngle
    };
}

/**
 * Calculates the angle formed by the left ankle, centre of mass, and right ankle based on the keypoints provided, and returns half of this angle as the left and right leg separation angles.
 *
 * @param {posedetection.Keypoint[]} keypoints - An array of keypoints where each keypoint has a name and position.
 * @returns {{ left: number | null, right: number | null }} An object with two properties, `left` and `right`. Each property represents half of the calculated angle. If the left ankle, centre of mass, or right ankle keypoints are not found, the corresponding property in the returned object is null.
 */
export function calculateLegSeparationAngle(keypoints: posedetection.Keypoint[]): { left: number | null, right: number | null } {
    const centreOfMass = keypoints.find(k => k.name === 'centre_of_mass');
    const leftAnkle = keypoints.find(k => k.name === 'left_ankle');
    const rightAnkle = keypoints.find(k => k.name === 'right_ankle');

    const angle = centreOfMass && leftAnkle && rightAnkle ? calculateAngle(leftAnkle, centreOfMass, rightAnkle) : null;

    return { left: angle !== null ? angle / 2 : null, right: angle !== null ? angle / 2 : null };
}

/**
 * Calculates the angle (in degrees) between three points using the dot product.
 *
 * @param {Object} A - The first point with x and y coordinates.
 * @param {Object} B - The second point (the vertex of the angle) with x and y coordinates.
 * @param {Object} C - The third point with x and y coordinates.
 * @returns {number} The angle in degrees between points A, B, and C. If the magnitude of BA or BC is 0, it returns 0.
 */
export function calculateAngle(A: {x: number, y: number}, B: {x: number, y: number}, C: {x: number, y: number}): number {
    const BA = { x: A.x - B.x, y: A.y - B.y };
    const BC = { x: C.x - B.x, y: C.y - B.y };

    const dotProduct = BA.x * BC.x + BA.y * BC.y;
    const magnitudeBA = Math.sqrt(BA.x * BA.x + BA.y * BA.y);
    const magnitudeBC = Math.sqrt(BC.x * BC.x + BC.y * BC.y);

    if (magnitudeBA === 0 || magnitudeBC === 0) {
        return 0;
    }

    const cosineAngle = dotProduct / (magnitudeBA * magnitudeBC);
    const angle = Math.acos(cosineAngle) * (180 / Math.PI);

    return parseFloat(angle.toFixed(2)); 
}