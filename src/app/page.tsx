'use client';

import { useEffect, useRef, useState } from 'react';

import bookOfPrayer from './../bookOfPrayer.json';

interface PrayerPassages {
  'First Psalm'?: string;
  'Second Psalm'?: string;
  'Old Testament'?: string;
  'New Testament'?: string;
  Gospel?: string;
}

export default function Home() {
  const passageInputRef = useRef<HTMLInputElement | null>(null);
  const questionInputRef = useRef<HTMLInputElement | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null);

  const [loading, setLoading] = useState(false);
  const [passageInput, setPassageInput] = useState('');
  const [questionInput, setQuestionInput] = useState('');
  const [answer, setAnswer] = useState('');
  const [randomPassage, setRandomPassage] = useState('');

  const stopStream = () => {
    if (readerRef.current) {
      readerRef.current.cancel();
      setLoading(false);
    }
  };

  async function fetchPassage(reference: string) {
    try {
      const res = await fetch(`/randomPassage/${reference}`);

      if (!res.ok) {
        throw new Error('Error fetching random passage');
      }

      const passageHtml = await res.json();

      setRandomPassage(passageHtml);
    } catch (err) {
      console.error(err);
      window.alert('Error retrieving passage. Please refresh, or submit a bug report');
    }
  }

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setRandomPassage('');
    setAnswer('');

    fetchPassage(passageInput);

    if (questionInput.trim() === '') return;

    setLoading(true);

    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          passage: passageInput,
          question: questionInput,
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = response.body;

      if (!data) return;

      const reader = data.getReader();

      readerRef.current = reader;

      const decoder = new TextDecoder();

      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();

        done = doneReading;

        const chunkValue = decoder.decode(value);

        setAnswer((prev) => prev + chunkValue);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      window.alert('Error answering your question. Please try again, or submit a bug report');
    }
  }

  async function fetchRandomPassage() {
    const PrayerPassagesTyped: PrayerPassages[] = bookOfPrayer as PrayerPassages[];
    const i = Math.floor(Math.random() * PrayerPassagesTyped.length);
    const passageReferences = PrayerPassagesTyped[i];

    const passageCategories = Object.keys(passageReferences) as (keyof PrayerPassages)[];
    const j = Math.floor(Math.random() * passageCategories.length);
    const passageCategory = passageCategories[j];

    const reference = passageReferences[passageCategory];

    try {
      const res = await fetch(`/randomPassage/${reference}`);

      if (!res.ok) {
        throw new Error('Error fetching random passage');
      }

      const passageHtml = await res.json();

      setRandomPassage(passageHtml);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    passageInputRef.current?.focus();
  }, []);

  useEffect(() => {
    fetchRandomPassage();
  }, []);

  return (
    <div className="flex flex-col bg-slate-800">
      <main className=" mb-auto min-h-screen overflow-y-scroll px-5 text-center">
        <div className="mx-auto max-w-lg px-3">
          <h1 className="mb-5 mt-10 text-5xl text-slate-200">BibleGPT</h1>
          <form onSubmit={handleSubmit} className="mb-5 flex flex-col items-center">
            <input
              ref={passageInputRef}
              type="text"
              name="passage"
              placeholder="Enter a Passage"
              value={passageInput}
              className="input-bordered input-accent input mb-3 w-full text-center"
              onChange={(e) => {
                setPassageInput(e.target.value);
              }}
            />
            <input
              ref={questionInputRef}
              type="text"
              name="question"
              placeholder="Enter a Question"
              value={questionInput}
              className="input-bordered input-accent input mb-3 w-full text-center"
              onChange={(e) => {
                setQuestionInput(e.target.value);
              }}
            />
            <div className="">
              <input
                type="button"
                value="Clear Question"
                className="btn-neutral btn mr-4"
                onClick={() => {
                  setQuestionInput('');
                  questionInputRef.current?.focus();
                }}
              />
              {!loading ? (
                <input type="submit" value="Ask" className="btn-accent btn" disabled={loading} />
              ) : (
                <button onClick={stopStream} className="btn-secondary btn">
                  Stop Loading
                </button>
              )}
            </div>
          </form>

          {randomPassage && <div className="mb-10 text-justify text-slate-400" dangerouslySetInnerHTML={{ __html: randomPassage }} />}
          {!randomPassage && !answer && !loading && <div className="text-slate-400">Looking up a passage...</div>}

          <div>
            <p className="mb-10 text-justify text-slate-400">
              {answer}
              {loading && '▋'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
