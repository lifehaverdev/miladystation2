export default function createBalancedBar(totalPossiblePoints:number, spentPoints:number, qoints:number, segments:number = 7) {
    //console.log('inside of createbalancebar',totalPossiblePoints,spentPoints,qoints,segments)
    let bar:string[] = [];

    // Threshold values for each emoji (for regenerative points)
    const regeneratingEmojiTiers = [
        { emoji: '💎', value: 10000 },
        { emoji: '💠', value: 1000 },
        { emoji: '🔷', value: 100 },
        { emoji: '🔹', value: 10 }
    ];

    // Threshold values for each emoji (for qoints)
    const qointEmojiTiers = [
        { emoji: '☀️', value: 10000 },
        { emoji: '🧀', value: 1000 },
        { emoji: '🔶', value: 100 },
        { emoji: '🔸', value: 10 }
    ];

    // Function to fill emojis based on remaining points, ensuring we hit exactly 7 emojis
    function fillSegments(points:number, tiers:any, remainingSegments:number) {
        const emojiBar = [];
        let segmentCount = remainingSegments;

        for (const tier of tiers) {
            while (points >= tier.value && segmentCount > 0) {
                emojiBar.push(tier.emoji);
                points -= tier.value;
                segmentCount--;
            }
        }

        // If there are remaining segments, but not enough points for the largest emojis
        while (segmentCount > 0) {
            if (points > 0) {
                emojiBar.push('🔹'); // Use the smallest emoji for leftover points
                points -= 10; // Subtract small points
            } else {
                emojiBar.push('▫️'); // Add white squares if no points remain
            }
            segmentCount--;
        }

        return emojiBar;
    }

    // Case 1: If the user has qoints and some regenerative points remain
    if (qoints && qoints > 0 && totalPossiblePoints > 0) {
        // First emoji is always qoints
        bar = bar.concat(fillSegments(qoints, qointEmojiTiers, 1));

        // Remaining segments are regenerative points
        const regenPoints = totalPossiblePoints - spentPoints;
        bar = bar.concat(fillSegments(regenPoints, regeneratingEmojiTiers, segments - 1));

        // If spentPoints > 0, replace the last emoji with a white square
        if (spentPoints > 0) {
            bar[bar.length - 1] = '▫️'; // Replace the last emoji
        }
    }

    // Case 2: If the user only has regenerative points (no qoints)
    else if (!qoints || qoints <= 0) {
        // Fill the entire bar with regenerative points
        const regenPoints = totalPossiblePoints - spentPoints;
        bar = fillSegments(regenPoints, regeneratingEmojiTiers, segments);

        // If points have been spent, replace the last emoji with a white square
        if (spentPoints > 0) {
            bar[bar.length - 1] = '▫️'; // Replace the last emoji
        }
    }

    // Case 3: If the user has no regenerative points left, only qoints remain
    else if (totalPossiblePoints <= spentPoints && qoints && qoints > 0) {
        bar = fillSegments(qoints, qointEmojiTiers, segments);

        // If qoints are low, ensure the last segment is a white square
        const lowestQointValue = qointEmojiTiers[qointEmojiTiers.length - 1].value;
        if (qoints < lowestQointValue * segments) {
            bar[bar.length - 1] = '▫️'; // Replace the last emoji
        }
    }

    // Ensure the bar is exactly 7 emojis long
    while (bar.length > segments) {
        bar.pop(); // Remove excess emojis if necessary
    }

    return bar.join(''); // Convert array to string before returning
}
