import { TBrandingSettings } from "../../store/api/settings/type";
import { useEffect, useState } from "react";
import _ from "lodash";
// import { KnobComponent } from "../web-components";
import { AlbumArtUploadComponent } from "../commons/AlbumArtUploadComponent";
import { RangeSliderComponent } from "../web-components/RangeSliderComponent";

type TProps = {
    brandingSettings: TBrandingSettings;
    updateSettings: (settings: TBrandingSettings) => void;
    disabled?: boolean;
};
export const BrandingSettings = ({ brandingSettings, updateSettings, disabled }: TProps) => {
    const [settings, setSettings] =
        useState<TBrandingSettings>(brandingSettings);
    const [propSnapshot, setPropSnapshot] =
        useState<TBrandingSettings>(brandingSettings);



    useEffect(() => {
        if (!_.isEqual(propSnapshot, brandingSettings)) {
            setPropSnapshot(brandingSettings);
            setSettings(brandingSettings);
        }
    }, [brandingSettings]);

    // handle change
    const handleChange = (
        key: keyof TBrandingSettings,
        value: string | boolean | number
    ) => {
        setSettings((prev) => ({
            ...prev,
            [key]: value as TBrandingSettings[keyof TBrandingSettings],
        }));
    };

    useEffect(() => {
        const isEqual = _.isEqual(settings, propSnapshot);
        if (!isEqual) {
            updateSettings(settings);
        }
    }, [settings, propSnapshot]);

    return (
        <s-stack direction="block" gap="base">
            <s-box background={disabled ? "subdued" : "base"} border="base" borderRadius="base" padding="base">
                <s-stack direction="block" gap="small">
                    <s-stack direction="block" gap="small">
                        {/* <KnobComponent
                            label="Show branding on shared images"
                            name="showWatermark"
                            selected={settings.showWatermark}
                            onValueChange={({ name, value }) => handleChange(name as keyof TBrandingSettings, value)}
                            description="Adds your logo and store URL to shared/downloaded images"
                        /> */}
                        {settings.showWatermark && (<>

                            {/* Preview */}
                            <div>
                                <div style={{ marginBottom: "8px" }}>
                                    <s-text type="strong">Preview</s-text>
                                </div>
                                <div
                                    style={{
                                        background: "#f6f6f7",
                                        borderRadius: "8px",
                                        // padding: "16px",
                                        position: "relative",
                                        aspectRatio: "9/16",
                                        maxWidth: "180px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {/* Preview Container - simulates exported image with white background */}
                                    <div
                                        style={{
                                            position: "relative",
                                            width: "100%",
                                            height: "100%",
                                            // background: "#fff",
                                            borderRadius: "4px",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {/* Safe Zone Line */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "16%",
                                                left: "8px",
                                                right: "8px",
                                                borderTop: "1px dashed #c9cccf",
                                                zIndex: 1,
                                            }}
                                        >
                                            {/* <span
                                                style={{
                                                    position: "absolute",
                                                    top: "2px",
                                                    right: 0,
                                                    fontSize: "6px",
                                                    color: "#999",
                                                    background: "#f6f6f7",
                                                    padding: "1px 3px",
                                                }}
                                            >
                                                safe zone
                                            </span> */}
                                        </div>

                                        {/* Placeholder product silhouettes */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                transform: "translate(-50%, -50%)",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                gap: "8px",
                                                opacity: 0.3,
                                            }}
                                        >
                                            <svg
                                                width="48"
                                                height="48"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#666"
                                                strokeWidth="1.5"
                                            >
                                                <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
                                            </svg>
                                            <div style={{ display: "flex", gap: "24px" }}>
                                                <svg
                                                    width="40"
                                                    height="40"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="#666"
                                                    strokeWidth="1.5"
                                                >
                                                    <path d="M4 4h16v16H4z" />
                                                    <path d="M4 12h16" />
                                                </svg>
                                                <svg
                                                    width="36"
                                                    height="36"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="#666"
                                                    strokeWidth="1.5"
                                                >
                                                    <circle cx="12" cy="12" r="10" />
                                                    <path d="M8 12h8" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Logo watermark */}
                                        {settings.customLogo ? (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: "12px",
                                                    left: "50%",
                                                    transform: "translateX(-50%)",
                                                    width: `${(settings.logoSize / 100) * 32}px`,
                                                    height: `${(settings.logoSize / 100) * 32}px`,
                                                    minWidth: "32px",
                                                    minHeight: "32px",
                                                    maxWidth: "48px",
                                                    maxHeight: "48px",
                                                    background: "#fff",
                                                    borderRadius: "6px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                                    zIndex: 2,
                                                    padding: "4px",
                                                }}
                                            >
                                                <img
                                                    src={settings.customLogo}
                                                    alt="Custom Logo"
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "contain",
                                                    }}
                                                    onError={(e) => {
                                                        // Fallback if image fails to load
                                                        e.currentTarget.style.display = "none";
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: "12px",
                                                    left: "50%",
                                                    transform: "translateX(-50%)",
                                                    width: `${(settings.logoSize / 100) * 32}px`,
                                                    height: `${(settings.logoSize / 100) * 32}px`,
                                                    minWidth: "32px",
                                                    minHeight: "32px",
                                                    maxWidth: "48px",
                                                    maxHeight: "48px",
                                                    background: "#fff",
                                                    borderRadius: "6px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                                    zIndex: 2,
                                                }}
                                            >
                                                <svg
                                                    width={`${(settings.logoSize / 100) * 20}`}
                                                    height={`${(settings.logoSize / 100) * 20}`}
                                                    viewBox="0 0 1178.04 1178.04"
                                                    fill="#202223"
                                                    style={{
                                                        minWidth: "14px",
                                                        minHeight: "14px",
                                                        maxWidth: "28px",
                                                        maxHeight: "28px",
                                                    }}
                                                >
                                                    <g>
                                                        <path d="M341.09,425.85l6.5,1.15-1.15,6.5-.16.9-23.62,132.9,81.94,14.56c6.87,1.22,12.86,4.68,16.86,9.73,7.89,9.97,7.45,23.09-1.11,32.66-2.4,2.68-5.43,4.94-9.29,6.92-8.28,4.26-13.88,11.51-15.37,19.9-2.87,16.13,9.99,31.94,28.66,35.26,2.29.41,4.62.61,6.92.61,16.16,0,29.68-10.03,32.13-23.84,1.49-8.38-1.27-17.12-7.57-23.97-2.94-3.19-5.01-6.37-6.33-9.7-4.74-11.93-.63-24.4,10.22-31.04,4.05-2.48,8.86-3.79,13.91-3.79,1.74,0,3.52.16,5.27.47l58.44,10.39,8.82-49.64c-9.88,7.09-21.54,10.96-33.28,10.96-3.14,0-6.29-.28-9.36-.82-15.5-2.75-28.88-11.97-37.66-25.95-8.66-13.77-11.79-30.53-8.83-47.18,5.51-30.98,30.48-53.47,59.38-53.47,3.16,0,6.34.28,9.46.84,14.73,2.62,27.83,11.35,36.54,24.21l17.49-98.41c-28.61-8.19-55.34-25.07-75.82-47.98-23.59-26.39-36.89-58.73-37.91-91.83l-265.91,32.34-.39,142.23,140.31,24.94.9.16Z" />
                                                        <path d="M696.72,352.25c-23.69,12.63-50.26,19.3-76.83,19.3-3.63,0-7.25-.13-10.83-.39l-19.02,107.01c-1.22,6.87-4.68,12.86-9.73,16.86-4.57,3.62-10.18,5.62-15.79,5.62-1.39,0-2.78-.12-4.14-.36-4.65-.83-8.93-2.97-12.73-6.36-2.67-2.39-4.94-5.43-6.92-9.28-4.26-8.28-11.51-13.88-19.9-15.37-1.49-.26-3.01-.4-4.51-.4-14.58,0-27.8,12.49-30.75,29.06-3.32,18.67,7.1,36.19,23.23,39.05,1.48.26,3,.4,4.51.4,6.96,0,13.87-2.83,19.46-7.97,3.19-2.94,6.36-5.01,9.7-6.33,3.27-1.3,6.6-1.96,9.88-1.96,1.43,0,2.86.13,4.26.37,7,1.25,13,5.44,16.9,11.8,3.36,5.5,4.54,12.31,3.32,19.18l-10.39,58.44,49.64,8.82c-9.07-12.61-12.75-27.92-10.13-42.64,4.9-27.56,30.53-47.57,60.95-47.57,4.05,0,8.15.36,12.18,1.08,16.65,2.96,31.3,11.68,41.25,24.55,10.09,13.06,14.14,28.79,11.38,44.29-2.62,14.73-11.35,27.83-24.21,36.54l73.58,13.08,23.67-133.17.16-.9,1.16-6.51,6.51,1.16.9.16,140.31,24.94,48.64-133.65-238.48-121.98c-12.37,30.71-36,56.49-67.23,73.14Z" />
                                                        <path d="M814.53,764.93c-2.35-12.5,4.16-23.9,16.18-28.39,3.26-1.22,6.87-1.81,11.05-1.81h.69c9.18,0,17.41-3.81,22.57-10.45,4.76-6.13,6.53-14.08,4.97-22.37-1.61-8.59-6.56-16.47-13.92-22.18-6.69-5.19-14.78-8.05-22.79-8.05-9.21,0-17.44,3.8-22.59,10.43-5.22,6.73-6.85,15.75-4.46,24.74,1.11,4.19,1.47,7.97,1.09,11.53-1.36,12.76-10.8,21.89-23.49,22.71-.53.03-1.06.05-1.6.05-5.89,0-11.91-2.14-16.93-6.04l-46.89-36.4-30.92,39.83c2.7-.39,5.52-.59,8.32-.59,12.49,0,24.62,4.07,34.14,11.46,25.51,19.8,28.7,58.55,7.1,86.37-12.64,16.28-31.85,26-51.4,26-12.6,0-24.36-3.97-34.03-11.47-11.81-9.17-19.35-23-21.07-38.43l-68.68,88.47,172.17,133.66,156.54-201.65-65.67-50.98c-5.51-4.28-9.2-10.12-10.39-16.46Z" />
                                                        <path d="M577.58,777.6c1.49.26,3.01.4,4.51.4,14.59,0,27.81-12.49,30.75-29.06,1.63-9.17.02-18.33-4.54-25.79-4.4-7.2-11.04-11.91-18.68-13.27-1.48-.26-3-.4-4.51-.4-6.96,0-13.87,2.83-19.46,7.97-3.19,2.94-6.36,5.01-9.7,6.33-3.27,1.3-6.6,1.96-9.88,1.96-1.43,0-2.86-.13-4.26-.37-7-1.25-13.01-5.44-16.9-11.8-3.36-5.5-4.54-12.31-3.32-19.18l10.39-58.44-49.64-8.82c9.07,12.61,12.75,27.92,10.13,42.64-4.9,27.56-30.53,47.57-60.95,47.57-4.05,0-8.15-.36-12.18-1.08-16.65-2.96-31.3-11.68-41.25-24.55-10.09-13.06-14.14-28.79-11.38-44.29,2.62-14.73,11.35-27.83,24.21-36.54l-73.66-13.09-44.72,251.62,214.73,38.16,21.13-118.87c1.22-6.87,4.67-12.86,9.73-16.86,4.57-3.62,10.18-5.62,15.79-5.62,1.39,0,2.78.12,4.14.36,4.65.83,8.93,2.97,12.73,6.36,2.68,2.39,4.94,5.43,6.92,9.29,4.26,8.28,11.51,13.88,19.9,15.37Z" />
                                                    </g>
                                                    <rect x="191.37" y="27.58" width="794.93" height="54.23" />
                                                    <rect x="190.42" y="1097.5" width="796.27" height="54.22" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* URL watermark */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                bottom: "12px",
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                background: "#fff",
                                                padding: "6px 12px",
                                                borderRadius: "20px",
                                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: "8px",
                                                    fontWeight: 600,
                                                    color: "#202223",
                                                }}
                                            >
                                                Build A Fit @ yourstore.com
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ fontSize: "13px", marginTop: "6px" }}>
                                    <s-text color="subdued">
                                        Keep your logo above the safe zone line to prevent overlap with products
                                    </s-text>
                                </div>
                            </div>
                            <s-divider />
                            <s-stack direction="block" gap="small">
                                <AlbumArtUploadComponent
                                    albumArtUrl={settings.customLogo}
                                    onAlbumArtChange={(url) => handleChange("customLogo", url)}
                                    disabled={disabled}
                                />
                                <RangeSliderComponent
                                    label="Logo Size"
                                    name="logoSize"
                                    min={50}
                                    max={100}
                                    step={10}
                                    value={settings.logoSize}
                                    onValueChange={({ name, value }) =>
                                        handleChange(name as keyof TBrandingSettings, value)
                                    }
                                    isTextField
                                    suffix="%"
                                    isTextFieldDisabled
                                    disabled={disabled}
                                />
                            </s-stack>
                        </>

                        )}
                    </s-stack>
                </s-stack>
            </s-box>
        </s-stack>
    );
};