import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, MessageSquare, List, Award, Send, CheckCircle2, ThumbsUp, X } from 'lucide-react';
import { Product, Review } from '@/types/domain';
import { useLanguageStore } from '@/store/language.store';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { toast } from 'react-hot-toast';

interface ProductTabsProps {
  product: Product;
}

export const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  // Local reviews array state to support adding a review interactively
  const [localReviews, setLocalReviews] = useState<Review[]>(product.reviews || []);

  // Sorting & Filtering States
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');

  // Local state helpful click tracker
  const [helpfulCounts, setHelpfulCounts] = useState<
    Record<string, { count: number; clicked: boolean }>
  >({
    'rev-1': { count: 6, clicked: false },
    'rev-2': { count: 3, clicked: false },
  });

  // Review form states
  const [reviewerName, setReviewerName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  const formatNumber = (num: number) => {
    return isRtl
      ? new Intl.NumberFormat('ar-SA').format(num)
      : new Intl.NumberFormat('en-US').format(num);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewerName.trim()) {
      toast.error(t('product.reviews.error_name', { defaultValue: 'يرجى إدخال اسمك الكريم' }));
      return;
    }
    if (!reviewComment.trim()) {
      toast.error(t('product.reviews.error_comment', { defaultValue: 'يرجى كتابة نص التقييم' }));
      return;
    }

    const newReview: Review = {
      id: `local-rev-${Date.now()}`,
      productId: product.id,
      userId: 'anonymous-user',
      userName: reviewerName,
      rating: reviewRating,
      comment: reviewComment,
      isApproved: true,
      createdAt: new Date().toISOString(),
    };

    setLocalReviews((prev) => [newReview, ...prev]);
    toast.success(
      t('product.reviews.success', { defaultValue: 'تم إضافة تقييمك بنجاح! شكراً لك.' })
    );

    // Reset Form
    setReviewerName('');
    setReviewComment('');
    setReviewRating(5);
  };

  const handleHelpfulClick = (reviewId: string) => {
    setHelpfulCounts((prev) => {
      const state = prev[reviewId] || { count: 0, clicked: false };
      if (state.clicked) {
        return {
          ...prev,
          [reviewId]: { count: state.count - 1, clicked: false },
        };
      } else {
        return {
          ...prev,
          [reviewId]: { count: state.count + 1, clicked: true },
        };
      }
    });
  };

  // 1. Calculate Ratings Breakdown
  const totalReviewsCount = localReviews.length;

  const averageRating = useMemo(() => {
    if (totalReviewsCount === 0) return 0;
    const sum = localReviews.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / totalReviewsCount).toFixed(1));
  }, [localReviews, totalReviewsCount]);

  const ratingBreakdown = useMemo(() => {
    return [5, 4, 3, 2, 1].map((stars) => {
      const count = localReviews.filter((r) => r.rating === stars).length;
      const percentage = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
      return { stars, count, percentage };
    });
  }, [localReviews, totalReviewsCount]);

  // 2. Filter & Sort reviews
  const processedReviews = useMemo(() => {
    let result = [...localReviews];

    if (ratingFilter !== null) {
      result = result.filter((r) => r.rating === ratingFilter);
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'highest') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      result.sort((a, b) => a.rating - b.rating);
    }

    return result;
  }, [localReviews, ratingFilter, sortBy]);

  const specKeys = product.specifications ? Object.keys(product.specifications) : [];

  return (
    <div className="w-full bg-card border border-border/40 rounded-2xl p-6 shadow-xs font-tajawal select-none">
      {/* Tabs Header Buttons */}
      <div
        className="flex border-b border-border/30 pb-3 gap-2.5 overflow-x-auto scrollbar-none"
        role="tablist"
      >
        <button
          onClick={() => setActiveTab('desc')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold rounded-lg transition-colors border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
            activeTab === 'desc'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background border-border/50 text-muted-foreground hover:bg-muted/40 hover:text-foreground'
          }`}
          role="tab"
          aria-selected={activeTab === 'desc'}
        >
          <Award className="h-3.5 w-3.5" />
          <span>{t('product.tab_description', { defaultValue: 'الوصف التفصيلي' })}</span>
        </button>

        <button
          onClick={() => setActiveTab('specs')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold rounded-lg transition-colors border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
            activeTab === 'specs'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background border-border/50 text-muted-foreground hover:bg-muted/40 hover:text-foreground'
          }`}
          role="tab"
          aria-selected={activeTab === 'specs'}
        >
          <List className="h-3.5 w-3.5" />
          <span>{t('product.tab_specifications', { defaultValue: 'المواصفات الفنية' })}</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold rounded-lg transition-colors border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
            activeTab === 'reviews'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background border-border/50 text-muted-foreground hover:bg-muted/40 hover:text-foreground'
          }`}
          role="tab"
          aria-selected={activeTab === 'reviews'}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>
            {t('product.tab_reviews', { defaultValue: 'تقييمات العملاء' })} (
            {formatNumber(localReviews.length)})
          </span>
        </button>
      </div>

      {/* Tabs Content Panels */}
      <div className="mt-6 text-right select-text">
        {/* Description Panel */}
        {activeTab === 'desc' && (
          <div
            role="tabpanel"
            className="leading-relaxed text-sm text-muted-foreground/90 font-light space-y-4 animate-fade-in"
          >
            <p>{isRtl ? product.descriptionAr : product.descriptionEn}</p>
            <p className="text-xs text-gold/85 font-bold font-tajawal select-none">
              {t('product.guarantee_text', {
                defaultValue:
                  '✓ منتج طبيعي بنسبة ١٠٠٪ مصنع ومعبأ بأعلى معايير الجودة وسلامة الغذاء.',
              })}
            </p>
          </div>
        )}

        {/* Specifications Panel */}
        {activeTab === 'specs' && (
          <div
            role="tabpanel"
            className="overflow-hidden border border-border/40 rounded-xl bg-background/50 animate-fade-in"
          >
            {specKeys.length > 0 ? (
              <table className="w-full text-xs text-right border-collapse">
                <tbody>
                  {specKeys.map((key, idx) => (
                    <tr
                      key={key}
                      className={
                        idx % 2 === 0
                          ? 'bg-muted/15 border-b border-border/20'
                          : 'border-b border-border/20'
                      }
                    >
                      <td className="px-4 py-3 font-bold text-primary border-l border-border/20 w-1/3 bg-muted/5 select-none">
                        {key}
                      </td>
                      <td className="px-4 py-3 font-medium text-muted-foreground">
                        {product.specifications![key]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-xs text-muted-foreground select-none">
                {t('product.no_specifications', {
                  defaultValue: 'لا توجد مواصفات فنية لهذا المنتج',
                })}
              </div>
            )}
          </div>
        )}

        {/* Reviews Panel */}
        {activeTab === 'reviews' && (
          <div role="tabpanel" className="flex flex-col gap-8 animate-fade-in">
            {/* 1. Rating Overview breakdown grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 border border-border/40 rounded-2xl bg-muted/5 w-full select-none items-center">
              {/* Score output */}
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <span className="text-5xl font-black font-sans text-gold">
                  {formatNumber(averageRating)}
                </span>
                <div className="flex items-center gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4.5 w-4.5 ${i < Math.round(averageRating) ? 'fill-gold text-gold' : 'text-muted-foreground/30'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {t('product.reviews.average_rating', {
                    count: totalReviewsCount,
                    defaultValue: `معدل التقييم بناءً على ${formatNumber(totalReviewsCount)} مراجعة`,
                  })}
                </span>
              </div>

              {/* Progress bars rows */}
              <div className="md:col-span-2 space-y-2.5">
                {ratingBreakdown.map((row) => {
                  const isFilterActive = ratingFilter === row.stars;
                  return (
                    <button
                      key={row.stars}
                      onClick={() => setRatingFilter(isFilterActive ? null : row.stars)}
                      className={`w-full flex items-center justify-between gap-3 text-xs font-bold transition-all p-1 rounded-lg cursor-pointer text-right border border-transparent ${
                        isFilterActive
                          ? 'bg-gold/5 border-gold/15 text-gold'
                          : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                      }`}
                      aria-label={`تصفية تقييمات ${row.stars} نجوم`}
                    >
                      <span className="w-10 text-[10px] text-muted-foreground text-left font-sans">
                        {row.percentage}%
                      </span>
                      {/* Bar tray */}
                      <div className="flex-1 h-2 rounded-full bg-border/60 dark:bg-border/30 overflow-hidden">
                        <div
                          className="h-full bg-gold rounded-full transition-all duration-300"
                          style={{ width: `${row.percentage}%` }}
                        />
                      </div>
                      <span className="flex items-center gap-1 font-sans text-xs w-16">
                        <span>{row.stars}</span>
                        <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Main reviews list / filters bar / submit reviews column */}
            <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
              {/* Left Column: Filter Options & Reviews List */}
              <div className="flex-1 w-full flex flex-col gap-4">
                {/* Filters & Sorting Bar */}
                {totalReviewsCount > 0 && (
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-muted/10 border border-border/40 rounded-xl w-full select-none text-xs">
                    {/* Reset star filter */}
                    <div className="flex items-center gap-2">
                      {ratingFilter !== null && (
                        <button
                          onClick={() => setRatingFilter(null)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/10 text-[10px] font-bold cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                          <span>إلغاء التصفية ({ratingFilter} نجوم)</span>
                        </button>
                      )}
                      <span className="text-muted-foreground font-bold font-tajawal">
                        {isRtl
                          ? `عرض ${processedReviews.length} تقييم`
                          : `Showing ${processedReviews.length} reviews`}
                      </span>
                    </div>

                    {/* Sorting selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{isRtl ? 'ترتيب:' : 'Sort:'}</span>
                      <select
                        value={sortBy}
                        onChange={(e) =>
                          setSortBy(e.target.value as 'newest' | 'highest' | 'lowest')
                        }
                        className="bg-card border border-border/50 text-xs font-bold rounded-lg px-2.5 py-1 text-right outline-none focus:ring-1 focus:ring-gold"
                      >
                        <option value="newest">{isRtl ? 'الأحدث' : 'Newest'}</option>
                        <option value="highest">
                          {isRtl ? 'الأعلى تقييماً' : 'Highest Rating'}
                        </option>
                        <option value="lowest">{isRtl ? 'الأقل تقييماً' : 'Lowest Rating'}</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Review Cards list */}
                {processedReviews.length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted-foreground select-none border border-dashed rounded-xl flex flex-col items-center justify-center">
                    <MessageSquare className="h-8 w-8 text-gold opacity-50 mb-2" />
                    <span>
                      {ratingFilter !== null
                        ? t('product.no_matching_reviews', {
                            defaultValue: 'لا توجد تقييمات مطابقة لهذه الفئة حالياً.',
                          })
                        : t('product.no_reviews', {
                            defaultValue: 'لا توجد تقييمات بعد. كن أول من يقيم هذا المنتج!',
                          })}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {processedReviews.map((rev) => {
                      const helpfulState = helpfulCounts[rev.id] || { count: 0, clicked: false };
                      return (
                        <div
                          key={rev.id}
                          className="p-4 border border-border/40 bg-background/50 rounded-xl flex flex-col gap-2 animate-fade-in"
                        >
                          {/* User Header */}
                          <div className="flex items-center justify-between select-none">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-primary">{rev.userName}</span>
                              {/* Verified Purchase Tag */}
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/25">
                                <CheckCircle2 className="h-2.5 w-2.5" />
                                <span>{isRtl ? 'شراء مؤكد' : 'Verified Purchase'}</span>
                              </span>
                            </div>
                            <span className="text-[10px] text-muted-foreground font-sans">
                              {formatDate(rev.createdAt)}
                            </span>
                          </div>

                          {/* Rating stars display */}
                          <div className="flex items-center gap-0.5 text-gold select-none">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${i < rev.rating ? 'fill-gold text-gold' : 'text-muted-foreground/30'}`}
                              />
                            ))}
                          </div>

                          {/* Comment body */}
                          {rev.comment && (
                            <p className="text-xs text-muted-foreground/90 leading-relaxed font-light mt-1 select-text">
                              {rev.comment}
                            </p>
                          )}

                          {/* Helpful button action */}
                          <div className="flex items-center justify-end border-t border-border/20 pt-2.5 mt-2.5 select-none">
                            <button
                              onClick={() => handleHelpfulClick(rev.id)}
                              className={`inline-flex items-center gap-1.5 text-[10px] font-bold py-1.5 px-3 rounded-lg border transition-all cursor-pointer ${
                                helpfulState.clicked
                                  ? 'bg-gold/10 border-gold/30 text-gold scale-105'
                                  : 'bg-transparent border-border/40 hover:border-gold/20 text-muted-foreground hover:text-gold'
                              }`}
                            >
                              <ThumbsUp className="h-3 w-3" />
                              <span>{isRtl ? 'مفيد' : 'Helpful'}</span>
                              <span className="font-sans">
                                ({formatNumber(helpfulState.count)})
                              </span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Write a Review Form */}
              <div className="w-full lg:w-80 shrink-0 bg-background/60 border border-border/50 p-5 rounded-xl select-none">
                <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-1.5 justify-end">
                  <span>{t('product.write_review', { defaultValue: 'أضف تقييمك' })}</span>
                </h4>
                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3.5">
                  {/* Rating selection stars */}
                  <div className="flex flex-col gap-1.5 items-end">
                    <span className="text-xs font-bold text-muted-foreground">
                      {t('product.review_rating_label', { defaultValue: 'التقييم العام' })}
                    </span>
                    <div className="flex items-center gap-1.5" dir="ltr">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const rate = i + 1;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setReviewRating(rate)}
                            className="text-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-full p-0.5 cursor-pointer"
                            aria-label={`تقييم بـ ${rate} نجوم`}
                          >
                            <Star
                              className={`h-6 w-6 transition-all duration-150 ${
                                rate <= reviewRating
                                  ? 'fill-gold text-gold scale-105'
                                  : 'text-muted-foreground/30 hover:scale-105'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reviewer Name */}
                  <div className="flex flex-col gap-1 text-right">
                    <label
                      htmlFor="reviewer-name"
                      className="text-xs font-bold text-muted-foreground mb-1"
                    >
                      {t('product.review_name_label', { defaultValue: 'الاسم الكريم' })}
                    </label>
                    <Input
                      id="reviewer-name"
                      type="text"
                      placeholder={t('product.review_name_placeholder', {
                        defaultValue: 'مثال: أحمد الحربي',
                      })}
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="h-9 text-xs border-border/60 text-right px-2.5 rounded-lg"
                      required
                    />
                  </div>

                  {/* Review Comments */}
                  <div className="flex flex-col gap-1 text-right">
                    <label
                      htmlFor="reviewer-comment"
                      className="text-xs font-bold text-muted-foreground mb-1"
                    >
                      {t('product.review_comment_label', { defaultValue: 'التعليق أو الملاحظات' })}
                    </label>
                    <Textarea
                      id="reviewer-comment"
                      placeholder={t('product.review_comment_placeholder', {
                        defaultValue: 'اكتب تجربتك مع المنتج هنا...',
                      })}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="min-h-[80px] text-xs border-border/60 text-right p-2.5 rounded-lg resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full flex items-center justify-center gap-1.5 h-10 bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs rounded-lg mt-1 border-0"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{t('product.submit_review', { defaultValue: 'إرسال التقييم' })}</span>
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
