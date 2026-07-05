import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, MessageSquare, List, Award, Send } from 'lucide-react';
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

  const specKeys = product.specifications ? Object.keys(product.specifications) : [];

  return (
    <div className="w-full bg-card/40 border border-border/40 rounded-2xl p-6 shadow-xs font-tajawal select-none">
      {/* Tabs Header Buttons */}
      <div className="flex border-b border-border/30 pb-3 gap-2.5 overflow-x-auto" role="tablist">
        <button
          onClick={() => setActiveTab('desc')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold rounded-lg transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
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
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold rounded-lg transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
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
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold rounded-lg transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
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
            className="leading-relaxed text-sm text-muted-foreground/90 font-light space-y-4"
          >
            <p>{isRtl ? product.descriptionAr : product.descriptionEn}</p>
            <p className="text-xs text-gold/80 font-normal">
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
            className="overflow-hidden border border-border/40 rounded-xl bg-background/50"
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
                      <td className="px-4 py-3 font-bold text-primary border-l border-border/20 w-1/3 bg-muted/5">
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
          <div role="tabpanel" className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Reviews list */}
            <div className="flex-1 w-full flex flex-col gap-4">
              {localReviews.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground select-none border border-dashed rounded-xl">
                  {t('product.no_reviews', {
                    defaultValue: 'لا توجد تقييمات بعد. كن أول من يقيم هذا المنتج!',
                  })}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {localReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 border border-border/40 bg-background/50 rounded-xl flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary">{rev.userName}</span>
                        <span className="text-[10px] text-muted-foreground font-sans">
                          {formatDate(rev.createdAt)}
                        </span>
                      </div>

                      {/* Rating stars display */}
                      <div className="flex items-center gap-0.5 text-gold">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < rev.rating ? 'fill-gold text-gold' : 'text-muted-foreground/30'}`}
                          />
                        ))}
                      </div>

                      {rev.comment && (
                        <p className="text-xs text-muted-foreground/90 leading-relaxed font-light mt-1">
                          {rev.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write a Review Form */}
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
                          className="text-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-full p-0.5"
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
                  className="w-full flex items-center justify-center gap-1.5 h-10 bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs rounded-lg mt-1"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{t('product.submit_review', { defaultValue: 'إرسال التقييم' })}</span>
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
