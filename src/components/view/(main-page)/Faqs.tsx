"use client";

import FaqAccordion, { FaqItem } from "@/components/ui/accordion/FaqAccordion";
import { Dictionary } from "@/lib/i18n/getDictionary";
import { useSimpleTextAnimation } from "@/styles/animations/useSimpleTextAnimation";

const Faqs = ({ dict }: { dict: Dictionary }) => {
  const { titleRef, paragraphRef, containerRef } = useSimpleTextAnimation({
    titleText: dict?.home?.frequentlyAskedQuestions?.title || "",
    paragraphText: dict?.home?.frequentlyAskedQuestions?.description || "",
  });

  // FAQ data
  const faqItems: FaqItem[] = [
    {
      id: "1",
      question: dict?.home?.frequentlyAskedQuestions?.questions?.question1,
      answer: dict?.home?.frequentlyAskedQuestions?.questions?.answer1,
    },
    {
      id: "2",
      question: dict?.home?.frequentlyAskedQuestions?.questions?.question2,
      answer: dict?.home?.frequentlyAskedQuestions?.questions?.answer2,
    },
    {
      id: "3",
      question: dict?.home?.frequentlyAskedQuestions?.questions?.question3,
      answer: dict?.home?.frequentlyAskedQuestions?.questions?.answer3,
    },
    {
      id: "4",
      question: dict?.home?.frequentlyAskedQuestions?.questions?.question4,
      answer: dict?.home?.frequentlyAskedQuestions?.questions?.answer4,
    },
    {
      id: "5",
      question: dict?.home?.frequentlyAskedQuestions?.questions?.question5,
      answer: dict?.home?.frequentlyAskedQuestions?.questions?.answer5,
    },
  ];

  return (
    <section className="home-padding bg-bg">
      <div className="home-wrapper">
        <div className="text-center mb-16" ref={containerRef}>
          <h1 className="home-heading" ref={titleRef}>
            {dict?.home?.frequentlyAskedQuestions?.title}
          </h1>
          <p className="home-desc" ref={paragraphRef}>
            {dict?.home?.frequentlyAskedQuestions?.description}
          </p>
        </div>
        <div className="max-w-[1120px] w-full mx-auto">
          <FaqAccordion items={faqItems} />
        </div>
      </div>
    </section>
  );
};

export default Faqs;
