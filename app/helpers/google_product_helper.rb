module GoogleProductHelper 
  def generate_google_product_info(services: , questionnaire: , in_city: , interpreter_name: , langs: )
    product_info = {
      "@context" => "http://schema.org/",
      "@type" => "Product",
      "name" => "#{interpreter_name} - #{t('interpreter.title_city', city: in_city)}",
      "image" => "#{questionnaire.photo_url}",
      "description" => "#{t("show_interpreter.desc_addition", langs: langs, city: in_city)} #{l_questionnaire(:short_summary)}",
      "aggregateRating" => generate_google_aggregate_rating(questionnaire),
      "sku": "qi_#{questionnaire.id}",
      "mpn": "20#{questionnaire.id}01#{questionnaire.user_id}",
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "#{questionnaire.currency_code}",
        "lowPrice": "#{services.last.calculated_price}",
        "highPrice": "#{services.first.calculated_price}",
        "offerCount": "#{services.count}",
        "seller": {
          "@type": "Organization",
          "name": "Interpreters Travel"
        }
      }
    }
    
    if (questionnaire.best_review)
      product_info["review"] = {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "#{questionnaire.best_review.score}",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "#{questionnaire.best_review.client}"
        }
      }
    else 
      product_info["review"] = {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Organization",
          "name": "Interpreters Travel"
        }
      }
    end

    product_info
  end

  def generate_google_aggregate_rating(questionnaire)
    result = {
      "@type" => "AggregateRating",
      "ratingValue" => "#{convert_to_rating questionnaire.score}",
      "ratingCount" => "1"
    }

    if (questionnaire.client_reviews_count > 0) 
      result["reviewCount"] = "#{questionnaire.client_reviews_count}"
      result["ratingCount"] = "#{questionnaire.client_reviews_count}"
    end

    result
  end
end