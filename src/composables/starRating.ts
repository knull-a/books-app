export function useStarRating(rating: number): string {
    const maxRating = 5;
    const filledStars = Math.round(rating);
    const remainingStars = maxRating - filledStars;
    const stars = '★'.repeat(filledStars) + '☆'.repeat(remainingStars);
    return stars;
}