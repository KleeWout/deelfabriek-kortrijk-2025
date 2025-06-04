namespace Deelkast.API.Services;

public interface IReviewService
{

    Task<IEnumerable<Review>> GetAllReviewsAsync();
    Task AddReviewAsync(Review review);
}
public class ReviewService: IReviewService
{

    private readonly IGenericRepository<Review> _reviewRepository;



    public ReviewService(IGenericRepository<Review> reviewRepository ){
        _reviewRepository = reviewRepository;
    }

      public async Task<IEnumerable<Review>> GetAllReviewsAsync()
    {
        return await _reviewRepository.GetAllAsync();
    }


    public async Task AddReviewAsync(Review review)
    {
        await _reviewRepository.AddAsync(review);
    }
 
}