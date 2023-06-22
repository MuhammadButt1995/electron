/* eslint-disable arrow-body-style */

'use client';

import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const WiFiFactors = () => {
  const { toast } = useToast();
  return (
    <div className='p-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h2 className='text-2xl font-semibold tracking-tight'>
            Understanding Wi-Fi Metrics
          </h2>
          <p className='text-muted-foreground text-sm'>
            Explanations of key metrics that affect your Wi-Fi strength.
          </p>
        </div>
      </div>

      <div className='mt-6 grid grid-cols-3 gap-4'>
        <Button
          variant='outline'
          onClick={() =>
            toast({
              title: `Signal Strength`,
              description:
                "This is like the volume of your Wi-Fi. A stronger signal means a louder, clearer 'voice' for your Wi-Fi. Good signal strength is typically around -30 dBm, adequate is around -67 dBm, and anything below -70 dBm is considered poor and might lead to slower internet speeds or dropped connections. For example, a strong signal is important for video calls on Microsoft Teams to prevent dropped calls or poor video quality.",
            })
          }
        >
          Signal Strength
        </Button>

        <Button
          variant='outline'
          onClick={() =>
            toast({
              title: `Radio Type`,
              description:
                "This is the version of Wi-Fi your device uses. Newer versions (like Wi-Fi 5 or Wi-Fi 6) can 'talk' and 'listen' faster than older ones. Devices using Wi-Fi 5 (802.11ac) or Wi-Fi 6 (802.11ax) are considered good, while Wi-Fi 4 (802.11n) is adequate, and anything older is poor and may limit your internet speed. For example, a newer radio type can help with faster loading times when using web-based apps like Microsoft O365.",
            })
          }
        >
          Radio Type
        </Button>

        <Button
          variant='outline'
          onClick={() =>
            toast({
              title: `Channel`,
              description:
                "This is like the lane your Wi-Fi uses on a highway. If too many devices are in the same lane, it can get crowded and slow everyone down. Channels 1, 6, and 11 are often the least crowded in the 2.4 GHz band, while higher channels in the 5 GHz band are typically less congested. For example, using a less crowded channel can help prevent interference from other devices when you're on a video call.",
            })
          }
        >
          Channel
        </Button>

        <Button
          variant='outline'
          onClick={() =>
            toast({
              title: `Latency`,
              description:
                "This is the delay before a transfer of data begins. Imagine it as the time it takes for your Wi-Fi's 'voice' to reach your device. Good latency is under 30 milliseconds, adequate is 50-100 milliseconds, and anything over 100 milliseconds might lead to noticeable delays in video calls. For example, low latency is important for real-time collaboration in Microsoft Teams.",
            })
          }
        >
          Latency
        </Button>

        <Button
          variant='outline'
          onClick={() =>
            toast({
              title: `Bandwidth`,
              description:
                "This is the maximum amount of data your Wi-Fi can send at once. It's like the width of a water pipe: a wider pipe can carry more water. For a good internet experience, you'd want a bandwidth of at least 25 Mbps. Anything between 5-25 Mbps is adequate for basic tasks, while below 5 Mbps might lead to slow loading times. For example, higher bandwidth is needed for activities like video conferencing or streaming high-definition video.",
            })
          }
        >
          Bandwidth
        </Button>

        <Button
          variant='outline'
          onClick={() =>
            toast({
              title: `Noise Level`,
              description:
                "This is the amount of other signals and static that can interfere with your Wi-Fi. It's like trying to talk in a noisy room. A good noise level is around -100 dBm, adequate is -90 dBm, and anything above -80 dBm is considered high and might interfere with your Wi-Fi. For example, a high noise level might cause issues with video or audio quality during a Microsoft Teams call.",
            })
          }
        >
          Noise Level
        </Button>

        <Button
          variant='outline'
          onClick={() =>
            toast({
              title: `Signal-to-Noise Ratio`,
              description:
                "This is the difference between the volume of your Wi-Fi and the background noise. It's like trying to hear someone talk in a noisy room. An SNR of 20-30 dB is good, 10-20 dB is adequate, and anything under 10 dB might make it hard to maintain a stable connection. For example, a higher SNR can help ensure a stable connection when you're sharing your screen during a Microsoft Teams meeting.",
            })
          }
        >
          SNR
        </Button>

        <Button
          variant='outline'
          onClick={() =>
            toast({
              title: `Quality`,
              description:
                "This is a measure of how clear your Wi-Fi signal is. It's like the sound quality of someone's voice on a phone call. A quality score of 70% or higher is good,50-70% is adequate, and anything below 50% might lead to a poor internet experience. For example, a high-quality Wi-Fi signal can help ensure smooth and uninterrupted video calls or web browsing.",
            })
          }
        >
          Quality
        </Button>

        <Button
          variant='outline'
          onClick={() =>
            toast({
              title: `Packet Loss`,
              description:
                "This is when data sent over Wi-Fi doesn't reach its destination. It's like if some of your Wi-Fi's 'words' got lost in transit. A packet loss rate of 1% or less is good, 1-2.5% is adequate, and anything over 2.5% might lead to noticeable issues like stuttering video or dropped calls. For example, high packet loss might cause issues during a Microsoft Teams call.",
            })
          }
        >
          Packet Loss
        </Button>

        <Button
          variant='outline'
          onClick={() =>
            toast({
              title: `Data Rate`,
              description:
                "This is the speed at which your Wi-Fi can send and receive data. It's like the speed of a car: faster is usually better. A data rate of 25 Mbps or higher is good, 5-25 Mbps is adequate for basic tasks, and anything below 5 Mbps might lead to slow loading times. For example, a high data rate can help with quick file downloads or uploads in Microsoft O365.",
            })
          }
        >
          Data Rate
        </Button>

        <Button
          variant='outline'
          onClick={() =>
            toast({
              title: `Download Speed`,
              description:
                "This is how quickly data can be transferred from the internet to your device. It's like how fast you can download a file or a video. A good download speed depends on your needs, but for streaming HD video, you'd want at least 5 Mbps. For 4K video, you'd want at least 25 Mbps. Anything below 1 Mbps might lead to slow loading times and buffering. For example, a good download speed is important for streaming video or downloading large files from the internet.",
            })
          }
        >
          Download Speed
        </Button>

        <Button
          variant='outline'
          onClick={() =>
            toast({
              title: `Upload Speed`,
              description:
                "This is how quickly data can be transferred from your device to the internet. It's like how fast you can upload a photo or a video to social media. A good upload speed also depends on your needs, but for video calls, you'd want at least 1-2 Mbps. For live streaming video, you'd want at least 5 Mbps. Anything below 0.5 Mbps might lead to slow upload times and issues with video calls. For example, a good upload speed is important for uploading files to Microsoft O365 or for video conferencing.",
            })
          }
        >
          Upload Speed
        </Button>
      </div>
    </div>
  );
};

export default WiFiFactors;
